import { ChevronRight, House, Star } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCartButton } from "@/app/product/[slug]/add-to-cart-button";
import { BundleBuilder } from "@/app/product/[slug]/bundle-builder";
import { MediaGallery } from "@/app/product/[slug]/media-gallery";
import { ProductAccordions } from "@/app/product/[slug]/product-accordions";
import { ProductReviews } from "@/app/product/[slug]/product-reviews";
import { RelatedProducts } from "@/app/product/[slug]/related-products";
import { sortVariantsByOptions } from "@/app/product/[slug]/variant-order";
import { Skeleton } from "@/components/ui/skeleton";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return (
		<div className="grid gap-4 md:grid-cols-8 lg:gap-6">
			<Skeleton className="aspect-[4/5] rounded-lg md:order-2 md:col-span-6" />
			<div className="grid grid-cols-4 gap-4 md:order-1 md:col-span-2 md:flex md:flex-col md:gap-6">
				<Skeleton className="aspect-[4/5] rounded-lg" />
				<Skeleton className="aspect-[4/5] rounded-lg" />
			</div>
		</div>
	);
}

function PurchasePanelSkeleton() {
	return (
		<div>
			<Skeleton className="mt-4 h-9 w-32" />
			<Skeleton className="mt-6 h-20 w-full" />
			<Skeleton className="mt-8 h-16 w-36" />
			<Skeleton className="mt-10 h-12 w-full rounded-lg" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="min-h-svh">
			<div className="container pt-6">
				<Skeleton className="h-5 w-48" />
			</div>
			<div className="container pb-16 pt-6 lg:grid lg:grid-cols-12 lg:gap-20">
				<div className="lg:col-span-7">
					<GallerySkeleton />
				</div>
				<div className="mt-8 lg:col-span-5 lg:mt-0">
					<Skeleton className="h-10 w-3/4" />
					<PurchasePanelSkeleton />
				</div>
			</div>
		</div>
	);
}

function StarRow({ rating }: { rating: number }) {
	const rounded = Math.round(rating);
	return (
		<span className="flex gap-0.5" aria-hidden>
			{Array.from({ length: 5 }, (_, i) => (
				<Star
					key={i}
					className={cn(
						"h-5 w-5",
						i < rounded ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200",
					)}
				/>
			))}
		</span>
	);
}

// `productGet` resolves the API error rather than null for a missing slug, so the
// `!product` branches below are unreachable without this: the throw escapes the
// streamed Suspense boundary and the route answers 200 with an empty shell.
async function safeProductGet(slug: string) {
	try {
		return await commerce.productGet({ idOrSlug: slug });
	} catch {
		return null;
	}
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	"use cache";
	cacheLife("minutes");
	const { slug } = await params;
	const product = await safeProductGet(slug);

	if (!product) {
		return { title: "Product Not Found", robots: { index: false, follow: true } };
	}

	const seoTitle = product.seo?.title || product.name;
	const seoDescription = product.seo?.description || product.summary || undefined;
	const canonical = product.seo?.canonical || `/product/${product.slug}`;
	const image = product.images[0];

	return {
		title: seoTitle,
		description: seoDescription,
		alternates: { canonical },
		openGraph: {
			type: "website",
			title: seoTitle,
			description: seoDescription,
			url: canonical,
			images: image ? [{ url: image, alt: product.name }] : undefined,
		},
		twitter: {
			card: image ? "summary_large_image" : "summary",
			title: seoTitle,
			description: seoDescription,
			images: image ? [image] : undefined,
		},
	};
}

// Awaiting params at the top of the page blocks the static shell — the page
// stays a sync shell and the params-dependent content streams inside Suspense.
export default function ProductPage(props: { params: Promise<{ slug: string }> }) {
	return (
		<Suspense fallback={<ProductPageSkeleton />}>
			<ProductDetails params={props.params} />
		</Suspense>
	);
}

const getProductPageData = async (slug: string) => {
	"use cache";
	cacheLife("minutes");

	const me = await meGetCached().catch(() => null);
	const reviewsEnabled = me?.store.settings?.enabledTools?.reviews ?? false;
	const restockNotificationsEnabled = me?.store.settings?.enabledTools?.restockNotifications ?? false;
	const [product, reviews] = await Promise.all([
		safeProductGet(slug),
		reviewsEnabled
			? commerce.productReviewsBrowse({ idOrSlug: slug }, { limit: 20 }).catch(() => null)
			: Promise.resolve(null),
	]);
	// The SDK gives the product a brand id only; an inactive brand isn't shown.
	const brand = product?.brandId
		? await commerce.brandGet({ idOrSlug: product.brandId }).catch(() => null)
		: null;

	return {
		product,
		reviews,
		restockNotificationsEnabled,
		brand: brand?.active ? { name: brand.name, slug: brand.slug } : null,
	};
};

const ProductDetails = async ({ params }: { params: Promise<{ slug: string }> }) => {
	const { slug } = await params;
	const { product, reviews, restockNotificationsEnabled, brand } = await getProductPageData(slug);

	if (!product) {
		notFound();
	}

	const reviewSummary = reviews?.summary ?? null;
	const variants = sortVariantsByOptions(product.variants);

	// The plans a shopper can pick, in the merchant's order. productGet lists inactive plans too, and
	// the cart refuses those.
	const plans = product.subscriptionPlanProducts
		.map(({ subscriptionPlan }) => subscriptionPlan)
		.filter((plan) => plan.active)
		.sort((a, b) => a.position - b.position)
		.map(({ id, name, discountPercent, benefits }) => ({ id, name, discountPercent, benefits }));

	const allImages = [
		...product.images,
		...variants.flatMap((v) => v.images).filter((img) => !product.images.includes(img)),
	];

	const productJsonLd = await buildProductJsonLd(product, reviews, brand?.name ?? null);

	return (
		<div className="min-h-svh">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{variants[0] && <TrackProductView variant={variants[0]} name={product.name} />}
			<nav aria-label="Breadcrumb" className="container pt-6">
				<ol className="flex flex-wrap items-center gap-1 text-sm text-gray-600">
					<li>
						<Link href="/" className="block text-gray-800 transition hover:text-gray-600">
							<span className="sr-only">Home</span>
							<House className="h-4 w-4" strokeWidth={1.75} aria-hidden />
						</Link>
					</li>
					{product.category ? (
						<>
							<li aria-hidden>
								<ChevronRight className="h-4 w-4" />
							</li>
							<li>
								<Link
									href={`/category/${product.category.slug}`}
									className="block transition hover:text-gray-900"
								>
									{product.category.name}
								</Link>
							</li>
						</>
					) : null}
					<li aria-hidden>
						<ChevronRight className="h-4 w-4" />
					</li>
					<li aria-current="page">{product.name}</li>
				</ol>
			</nav>

			<section className="container">
				<div className="pb-16 pt-6 lg:grid lg:grid-cols-12 lg:gap-20">
					<div className="lg:col-span-7">
						<Suspense fallback={<GallerySkeleton />}>
							<MediaGallery images={allImages} productName={product.name} variants={variants} />
						</Suspense>
					</div>

					<div className="mt-8 lg:col-span-5 lg:mt-0">
						{brand && (
							<Link
								href={`/products?brand=${encodeURIComponent(brand.slug)}`}
								className="mb-2 inline-flex min-h-6 items-center text-sm font-bold text-emerald-900 transition-colors hover:underline"
							>
								{brand.name}
							</Link>
						)}
						<h1 className="text-2xl font-bold text-zinc-800 sm:text-4xl">{product.name}</h1>
						{reviewSummary && reviewSummary.reviewCount > 0 && (
							<a href="#reviews" className="mt-3 flex items-center gap-4 text-sm">
								<StarRow rating={reviewSummary.averageRating} />
								<span className="text-emerald-900 hover:underline">
									{reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "Review" : "Reviews"}
								</span>
							</a>
						)}

						{/* Configurable bundle → group builder; otherwise the standard variant add-to-cart.
						    Renders only for bundle products, so it stays dormant for regular stores. */}
						{product.type === "bundle" && product.bundle?.groups?.length ? (
							<div className="mt-6">
								<BundleBuilder
									bundleId={product.id}
									bundle={product.bundle}
									pricing={{
										mode: product.bundlePriceMode,
										fixedPriceAmount: product.bundleFixedPriceAmount,
										fixedPriceAmountGross: product.bundleFixedPriceAmountGross,
										amountOffAmount: product.bundleAmountOffAmount,
										amountOffAmountGross: product.bundleAmountOffAmountGross,
									}}
								/>
							</div>
						) : (
							<Suspense fallback={<PurchasePanelSkeleton />}>
								<AddToCartButton
									variants={variants}
									product={{
										id: product.id,
										name: product.name,
										slug: product.slug,
										images: product.images,
									}}
									summary={product.summary}
									volumePricingTiers={product.volumePricingTiers}
									restockNotificationsEnabled={restockNotificationsEnabled}
									subscriptionMode={product.subscriptionMode}
									plans={plans}
								/>
							</Suspense>
						)}

						<ProductAccordions content={product.content} />
					</div>
				</div>
			</section>

			{reviews && (
				<section className="container">
					<ProductReviews reviews={reviews} slug={slug} />
				</section>
			)}

			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</div>
	);
};
