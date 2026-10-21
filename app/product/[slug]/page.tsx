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
import { CatalogNav } from "@/components/catalog-nav";
import { PlusIcon, ReviewStars } from "@/components/icons";
import { ExploreBanner } from "@/components/sections/explore-banner";
import { Gallery } from "@/components/sections/gallery";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return (
		<>
			<div className="hidden min-w-64 lg:block" />
			<div className="min-w-0 flex-1 lg:mx-16">
				<Skeleton className="aspect-[4/5] bg-tint" />
			</div>
		</>
	);
}

function PurchasePanelSkeleton() {
	return (
		<div className="space-y-4">
			<Skeleton className="h-6 w-40 bg-tint" />
			<Skeleton className="h-14 w-full bg-tint" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="min-h-svh pt-6 pb-12 sm:pt-12 sm:pb-24">
			<div className="mx-auto max-w-[1440px] px-6 lg:flex lg:px-8">
				<GallerySkeleton />
				<div className="pt-6 lg:w-96 lg:shrink-0 lg:pt-0">
					<Skeleton className="mb-4 h-14 w-3/4 bg-tint" />
					<PurchasePanelSkeleton />
				</div>
			</div>
		</div>
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
			<div className="pt-6 pb-12 sm:pt-12 sm:pb-24">
				<JsonLdScript data={productJsonLd} />
				<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
				{variants[0] && <TrackProductView variant={variants[0]} name={product.name} />}
				{/* Three columns from 1024px, as in the original: the sticky category list and
				    thumbnails, the stacked photographs, and the sticky purchase panel. */}
				<div className="mx-auto max-w-[1440px] px-6 lg:flex lg:px-8">
					<Suspense fallback={<GallerySkeleton />}>
						<MediaGallery
							images={allImages}
							productName={product.name}
							variants={variants}
							sidebar={
								<CatalogNav current={product.category ? `category:${product.category.slug}` : undefined} />
							}
						/>
					</Suspense>

					<div className="below-header pt-6 lg:sticky lg:w-96 lg:shrink-0 lg:self-start lg:pt-0">
						{reviewSummary && reviewSummary.reviewCount > 0 && (
							<a href="#reviews" className="inline-block">
								<ReviewStars rating={reviewSummary.averageRating} />
							</a>
						)}
						{brand && (
							<Link
								href={`/products?brand=${encodeURIComponent(brand.slug)}`}
								className="mt-2 inline-flex min-h-6 items-center text-caption font-medium uppercase tracking-[0.2em] text-ink-soft transition-opacity hover:opacity-70"
							>
								{brand.name}
							</Link>
						)}
						<h1 className="mt-2 mb-2 font-serif text-display-3 text-balance">{product.name}</h1>

						{/* Configurable bundle → group builder; otherwise the standard variant add-to-cart.
						    Renders only for bundle products, so it stays dormant for regular stores. */}
						{product.type === "bundle" && product.bundle?.groups?.length ? (
							<div className="py-6">
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

						<details className="group border-b border-black">
							<summary className="flex cursor-pointer list-none items-center justify-between py-4 font-medium [&::-webkit-details-marker]:hidden">
								Shipping and returns
								<PlusIcon className="size-6 transition-transform group-open:rotate-45" />
							</summary>
							<p className="pb-6 text-ink-soft">
								Shipping options and costs are shown at checkout, before you pay. Our store policies on
								returns and refunds are linked at the foot of every page.
							</p>
						</details>
						{product.content && (
							<details className="group border-b border-black">
								<summary className="flex cursor-pointer list-none items-center justify-between py-4 font-medium [&::-webkit-details-marker]:hidden">
									Details
									<PlusIcon className="size-6 transition-transform group-open:rotate-45" />
								</summary>
								<div className="prose prose-sm max-w-none pb-6 text-ink-soft tiptap-content">
									<TiptapRenderer content={product.content} />
								</div>
							</details>
						)}
					</div>
				</div>
			</div>

			{reviews && <ProductReviews reviews={reviews} slug={slug} />}

			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
			<ExploreBanner />
			<Gallery />
		</>
	);
};
