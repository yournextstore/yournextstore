import { Star } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCartButton } from "@/app/product/[slug]/add-to-cart-button";
import { BundleBuilder } from "@/app/product/[slug]/bundle-builder";
import { MediaGallery } from "@/app/product/[slug]/media-gallery";
import { ProductReviews } from "@/app/product/[slug]/product-reviews";
import { RelatedProducts } from "@/app/product/[slug]/related-products";
import { sortVariantsByOptions } from "@/app/product/[slug]/variant-order";
import { Crumbs } from "@/components/grilli/crumbs";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return (
		<div className="py-[30px] lg:sticky lg:top-24 lg:self-start">
			<Skeleton className="aspect-square bg-eerie-4" />
		</div>
	);
}

function PurchasePanelSkeleton() {
	return (
		<div className="space-y-6">
			<Skeleton className="h-20 w-full bg-eerie-4" />
			<Skeleton className="h-10 w-40 bg-eerie-4" />
			<Skeleton className="h-14 w-full bg-eerie-4" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="container-g min-h-svh py-10 lg:py-16">
			<Skeleton className="mb-6 h-5 w-64 bg-eerie-4" />
			<div className="lg:grid lg:grid-cols-2 lg:gap-16">
				<GallerySkeleton />
				<div className="mt-8 space-y-8 lg:mt-[30px]">
					<Skeleton className="h-14 w-3/4 bg-eerie-4" />
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
					className={cn("h-4 w-4", i < rounded ? "fill-gold text-gold" : "fill-eerie-4 text-eerie-4")}
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
		<>
			<div className="container-g pt-8 pb-[70px] lg:pt-12 lg:pb-[100px]">
				<JsonLdScript data={productJsonLd} />
				<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
				{variants[0] && <TrackProductView variant={variants[0]} name={product.name} />}
				<Crumbs
					className="mt-0 mb-4 [&_ol]:justify-center lg:[&_ol]:justify-start"
					trail={[
						{ href: "/", label: "Home" },
						{ href: "/products", label: "Shop" },
						...(product.category
							? [{ href: `/category/${product.category.slug}`, label: product.category.name }]
							: []),
					]}
					current={product.name}
				/>
				<div className="lg:grid lg:grid-cols-2 lg:gap-16 xl:gap-24">
					{/* Left: Image Gallery (sticky on desktop) */}
					<Suspense fallback={<GallerySkeleton />}>
						<MediaGallery images={allImages} productName={product.name} variants={variants} />
					</Suspense>

					{/* Right: Product Details */}
					<div className="mt-8 space-y-8 text-center lg:mt-[30px] lg:text-left">
						<div className="space-y-3">
							<p className="section-subtitle lg:after:mx-0">{product.category?.name ?? "Our Selection"}</p>
							<h1 className="font-display text-headline-1 text-balance text-white">{product.name}</h1>
							{brand && (
								<Link
									href={`/products?brand=${encodeURIComponent(brand.slug)}`}
									className="hover-underline inline-flex min-h-6 items-center text-label-2 font-bold tracking-3 text-silver uppercase transition-colors hover:text-gold"
								>
									{brand.name}
								</Link>
							)}
							{reviewSummary && reviewSummary.reviewCount > 0 && (
								<a
									href="#reviews"
									className="inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
								>
									<StarRow rating={reviewSummary.averageRating} />
									<span className="font-medium">{reviewSummary.averageRating.toFixed(1)}</span>
									<span className="text-silver underline-offset-4 hover:underline">
										({reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"})
									</span>
								</a>
							)}
						</div>

						{/* Configurable bundle → group builder; otherwise the standard variant add-to-cart.
						    Renders only for bundle products, so it stays dormant for regular stores. */}
						<div className="text-left">
							{product.type === "bundle" && product.bundle?.groups?.length ? (
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
						</div>
					</div>
				</div>

				{/* Full description (below the fold, full width) */}
				{product.content && (
					<section aria-labelledby="details-title" className="mt-[70px] border-t border-line pt-[70px]">
						<p className="section-subtitle text-center">The Details</p>
						<h2 id="details-title" className="mb-8 text-center font-display text-headline-2 text-white">
							Good to Know
						</h2>
						<div className="prose prose-invert mx-auto max-w-[720px] text-body-4 tiptap-content">
							<TiptapRenderer content={product.content} />
						</div>
					</section>
				)}

				{/* Reviews Section */}
				{reviews && <ProductReviews reviews={reviews} slug={slug} />}
			</div>

			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</>
	);
};
