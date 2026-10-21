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
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return <Skeleton className="mx-auto aspect-[3/4] w-full max-w-md rounded-lg" />;
}

function PurchasePanelSkeleton() {
	return (
		<div className="flex flex-col gap-4">
			<Skeleton className="mx-auto h-5 w-32" />
			<Skeleton className="h-12 w-full rounded-lg" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="mx-auto min-h-svh max-w-[82rem] px-4 pb-2">
			<div className="flex flex-col rounded-lg border border-t-0 border-border lg:flex-row lg:p-8">
				<div className="basis-full lg:basis-1/2">
					<GallerySkeleton />
				</div>
				<div className="basis-full space-y-6 p-3 lg:basis-1/2 lg:p-8">
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
					className={cn("h-4 w-4", i < rounded ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted")}
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

	const { currency, locale, taxBehavior } = await getStoreConfig();
	const range = product.variants.length > 0 ? priceRange(product.variants, taxBehavior) : null;
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });
	const pillPrice = range
		? range.min === range.max
			? fmt(range.min)
			: `${fmt(range.min)} – ${fmt(range.max)}`
		: null;

	return (
		<div className="mx-auto min-h-svh max-w-[82rem] px-4 pb-2">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{variants[0] && <TrackProductView variant={variants[0]} name={product.name} />}
			<div className="flex flex-col rounded-lg border border-t-0 border-border lg:flex-row lg:p-8">
				<div className="w-full basis-full lg:basis-1/2">
					<Suspense fallback={<GallerySkeleton />}>
						<MediaGallery images={allImages} productName={product.name} variants={variants} />
					</Suspense>
				</div>

				<div className="flex basis-full flex-col gap-6 p-3 lg:basis-1/2 lg:p-8">
					<div className="border-b border-border pb-6">
						<div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
							<div className="min-w-0 space-y-3">
								{brand && (
									<Link
										href={`/products?brand=${encodeURIComponent(brand.slug)}`}
										className="inline-flex min-h-6 items-center font-mono text-xs font-medium tracking-wide text-muted-foreground uppercase underline-offset-4 hover:underline"
									>
										{brand.name}
									</Link>
								)}
								<h1
									className={cn(
										"leading-tight font-bold break-words",
										product.name.length > 30 ? "text-3xl" : "text-4xl",
									)}
								>
									{product.name}
								</h1>
								{reviewSummary && reviewSummary.reviewCount > 0 && (
									<a
										href="#reviews"
										className="inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
									>
										<StarRow rating={reviewSummary.averageRating} />
										<span className="font-medium">{reviewSummary.averageRating.toFixed(1)}</span>
										<span className="text-muted-foreground underline-offset-4 hover:underline">
											({reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"})
										</span>
									</a>
								)}
							</div>
							{pillPrice ? (
								<div className="flex lg:justify-end">
									<p className="rounded-full bg-primary px-4 py-1 text-2xl font-bold whitespace-nowrap text-primary-foreground">
										{pillPrice}
									</p>
								</div>
							) : null}
						</div>
					</div>

					{/* Configurable bundle → group builder; otherwise the standard variant add-to-cart.
					    Renders only for bundle products, so it stays dormant for regular stores. */}
					<div className={variants.length > 1 ? "min-h-48" : "min-h-12"}>
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

					{product.content && (
						<div className="border-t border-border pt-4">
							<h2 className="sr-only">Product details</h2>
							<div className="prose tiptap-content max-w-none text-[1.125rem] leading-relaxed dark:prose-invert">
								<TiptapRenderer content={product.content} />
							</div>
						</div>
					)}

					{product.category && (
						<p className="text-sm text-muted-foreground">
							More in{" "}
							<Link
								href={`/category/${product.category.slug}`}
								className="font-medium text-foreground underline underline-offset-2"
							>
								{product.category.name}
							</Link>
						</p>
					)}
				</div>
			</div>

			{/* Reviews Section */}
			{reviews && <ProductReviews reviews={reviews} slug={slug} />}

			{/* Related Products */}
			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</div>
	);
};
