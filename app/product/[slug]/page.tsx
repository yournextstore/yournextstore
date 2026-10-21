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
import { Crumbs } from "@/components/crumbs";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { getStoreBrand } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return (
		<div className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
			<Skeleton className="aspect-square rounded-lg bg-gray-100" />
		</div>
	);
}

function PurchasePanelSkeleton() {
	return (
		<div>
			<Skeleton className="h-[27px] w-32 bg-gray-100" />
			<hr className="my-6 border-gray-300" />
			<Skeleton className="h-[38px] w-[122px] rounded-lg bg-gray-100" />
			<Skeleton className="mt-3 h-[39px] w-full rounded-lg bg-gray-100 sm:w-56" />
			<hr className="my-6 border-gray-300" />
			<Skeleton className="h-[60px] w-64 bg-gray-100" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="fc-container min-h-svh">
			<Skeleton className="mt-4 h-[21px] w-64 bg-gray-100" />
			<div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-14">
				<GallerySkeleton />
				<div className="space-y-4">
					<Skeleton className="h-[18px] w-24 bg-gray-100" />
					<Skeleton className="h-10 w-3/4 bg-gray-100" />
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
					className={cn("h-3.5 w-3.5", i < rounded ? "fill-sun text-sun" : "fill-gray-300 text-gray-300")}
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
	// `brand` is the product's brand; `store` is the theme's store-wide brand settings.
	const [{ product, reviews, restockNotificationsEnabled, brand }, store] = await Promise.all([
		getProductPageData(slug),
		getStoreBrand(),
	]);

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

	const details = [
		...(brand ? [{ label: "Brand", value: brand.name }] : []),
		...(product.category ? [{ label: "Type", value: product.category.name }] : []),
		{
			label: "Shipping",
			value: store.freeShippingLabel ? `Free over ${store.freeShippingLabel}` : "Calculated at checkout",
		},
	];

	return (
		<div className="fc-container min-h-svh">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{variants[0] && <TrackProductView variant={variants[0]} name={product.name} />}
			<Crumbs
				items={[
					{ href: "/", label: "Home" },
					{ href: "/products", label: "Shop" },
					...(product.category
						? [{ href: `/category/${product.category.slug}`, label: product.category.name }]
						: []),
					{ label: product.name },
				]}
			/>
			<section className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-14">
				<Suspense fallback={<GallerySkeleton />}>
					<MediaGallery images={allImages} productName={product.name} variants={variants} />
				</Suspense>

				<div className="min-w-0">
					{(brand || product.category) && (
						<div className="mb-4 flex flex-wrap items-center gap-x-3">
							{brand && (
								<Link
									href={`/products?brand=${encodeURIComponent(brand.slug)}`}
									className="inline-flex min-h-6 items-center font-semibold text-gray-800 transition hover:text-green-600"
								>
									{brand.name}
								</Link>
							)}
							{product.category && (
								<Link
									href={`/category/${product.category.slug}`}
									className="inline-flex min-h-6 items-center text-green-600 transition hover:text-green-700"
								>
									{product.category.name}
								</Link>
							)}
						</div>
					)}
					<h1 className="mb-1 text-fc-xl break-words lg:text-fc-2xl">{product.name}</h1>
					{reviewSummary && reviewSummary.reviewCount > 0 && (
						<a
							href="#reviews"
							className="mb-4 inline-flex items-center gap-2 text-fc-sm transition hover:opacity-80"
						>
							<StarRow rating={reviewSummary.averageRating} />
							<span className="text-green-600">
								({reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"})
							</span>
						</a>
					)}
					<div className="mt-4">
						{/* Configurable bundle → group builder; otherwise the standard variant add-to-cart.
						    Renders only for bundle products, so it stays dormant for regular stores. */}
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
									details={details}
								/>
							</Suspense>
						)}
					</div>
				</div>
			</section>

			{/* The original's tab strip, one tab: the long description. */}
			{product.content && (
				<section className="mt-10 lg:mt-14">
					<div className="border-b border-gray-300">
						<h2 className="-mb-px inline-block border-b-2 border-green-500 px-1 pb-3 text-fc-base text-gray-800">
							Product Details
						</h2>
					</div>
					<div className="prose prose-sm max-w-none py-8 tiptap-content">
						<TiptapRenderer content={product.content} />
					</div>
				</section>
			)}

			{reviews && <ProductReviews reviews={reviews} slug={slug} />}

			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</div>
	);
};
