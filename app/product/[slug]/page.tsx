import { Star } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCartButton } from "@/app/product/[slug]/add-to-cart-button";
import { BundleBuilder } from "@/app/product/[slug]/bundle-builder";
import { CollectionStory } from "@/app/product/[slug]/collection-story";
import { MediaGallery } from "@/app/product/[slug]/media-gallery";
import { ProductReviews } from "@/app/product/[slug]/product-reviews";
import { RelatedProducts } from "@/app/product/[slug]/related-products";
import { sortVariantsByOptions } from "@/app/product/[slug]/variant-order";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return <Skeleton className="aspect-[3/4] w-full rounded-none bg-grayscale-50 md:w-4/5" />;
}

function PurchasePanelSkeleton() {
	return (
		<div className="space-y-8">
			<Skeleton className="h-8 w-32 rounded-none bg-grayscale-50" />
			<Skeleton className="h-12 w-full rounded-xs bg-grayscale-50" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="layout pb-26 md:pt-5 md:pb-36 lg:pt-16">
			<div className="col-span-full flex gap-8 max-lg:flex-col xl:gap-27">
				<div className="flex-1">
					<GallerySkeleton />
				</div>
				<div className="flex-1 space-y-4">
					<Skeleton className="h-5 w-24 rounded-none bg-grayscale-50" />
					<Skeleton className="h-12 w-3/4 rounded-none bg-grayscale-50" />
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

	const collection = product.productCollections[0]?.collection ?? null;

	return (
		<div className="pb-26 md:pt-5 md:pb-36 lg:pt-16">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{variants[0] && <TrackProductView variant={variants[0]} name={product.name} />}
			<div className="layout">
				<div className="col-span-full mb-26 flex gap-8 max-lg:flex-col md:mb-52 xl:gap-27">
					{/* Edge to edge on phones: the gallery cancels the layout gutter. */}
					<div className="flex flex-col gap-8 max-md:-mx-4 lg:w-1/2 lg:flex-1">
						<Suspense fallback={<GallerySkeleton />}>
							<MediaGallery images={allImages} productName={product.name} variants={variants} />
						</Suspense>
					</div>
					<div className="flex-1 lg:sticky lg:top-26 lg:self-start">
						<div className="mb-2 flex flex-wrap gap-x-4">
							{brand && (
								<Link
									href={`/products?brand=${encodeURIComponent(brand.slug)}`}
									className="inline-flex min-h-6 items-center text-grayscale-500 transition-colors hover:text-foreground"
								>
									{brand.name}
								</Link>
							)}
							{collection ? (
								<Link
									href={`/collection/${collection.slug}`}
									className="inline-flex min-h-6 items-center text-grayscale-500 transition-colors hover:text-foreground"
								>
									{collection.name}
								</Link>
							) : product.category ? (
								<Link
									href={`/category/${product.category.slug}`}
									className="inline-flex min-h-6 items-center text-grayscale-500 transition-colors hover:text-foreground"
								>
									{product.category.name}
								</Link>
							) : null}
						</div>
						<h1 className="mb-2 text-title-md text-balance md:text-title-xl">{product.name}</h1>
						{reviewSummary && reviewSummary.reviewCount > 0 && (
							<a
								href="#reviews"
								className="mb-4 inline-flex items-center gap-2 text-body-xs transition-opacity hover:opacity-80"
							>
								<StarRow rating={reviewSummary.averageRating} />
								<span>{reviewSummary.averageRating.toFixed(1)}</span>
								<span className="text-grayscale-500 underline-offset-4 hover:underline">
									({reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"})
								</span>
							</a>
						)}

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
								/>
							</Suspense>
						)}
					</div>
				</div>
			</div>

			{product.content && (
				<section className="layout mb-26 md:mb-36">
					<h2 className="col-span-full mb-6 text-title-md md:col-span-5 md:text-title-2xl">Details</h2>
					<div className="prose prose-sm col-span-full max-w-none md:col-start-7 md:col-end-13 md:prose-base tiptap-content">
						<TiptapRenderer content={product.content} />
					</div>
				</section>
			)}

			{collection && <CollectionStory productName={product.name} collection={collection} />}

			{reviews && (
				<div className="layout">
					<div className="col-span-full">
						<ProductReviews reviews={reviews} slug={slug} />
					</div>
				</div>
			)}

			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</div>
	);
};
