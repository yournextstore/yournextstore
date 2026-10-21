import { ChevronRightIcon, PlusIcon, Star } from "lucide-react";
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
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

const summaryClass =
	"flex cursor-pointer list-none items-center justify-between px-4 py-5 text-label font-medium uppercase [&::-webkit-details-marker]:hidden";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return (
		<div className="rounded-sm border border-border p-1 lg:sticky lg:top-4 lg:self-start lg:p-2">
			<Skeleton className="aspect-square rounded-xs" />
		</div>
	);
}

function PurchasePanelSkeleton() {
	return (
		<div className="space-y-4">
			<Skeleton className="h-8 w-32 rounded-xs" />
			<Skeleton className="h-8 w-40 rounded-xs" />
			<Skeleton className="h-10 w-full rounded-sm" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="page-x min-h-svh py-4 lg:py-8">
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-16">
				<GallerySkeleton />
				<div className="rounded-sm border border-border p-5">
					<Skeleton className="mb-4 h-8 w-3/4 rounded-xs" />
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

	return { product, reviews, restockNotificationsEnabled };
};

const ProductDetails = async ({ params }: { params: Promise<{ slug: string }> }) => {
	const { slug } = await params;
	const { product, reviews, restockNotificationsEnabled } = await getProductPageData(slug);

	if (!product) {
		notFound();
	}

	const reviewSummary = reviews?.summary ?? null;

	const allImages = [
		...product.images,
		...product.variants.flatMap((v) => v.images).filter((img) => !product.images.includes(img)),
	];

	const productJsonLd = await buildProductJsonLd(product, reviews);

	const hasDetails = Boolean(product.summary || product.content);

	return (
		<div className="page-x min-h-svh py-4 lg:py-8">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-16">
				<Suspense fallback={<GallerySkeleton />}>
					<MediaGallery images={allImages} productName={product.name} variants={product.variants} />
				</Suspense>

				{/* The original's stack of bordered boxes: purchase panel, then accordions. */}
				<div>
					<div className="rounded-sm border border-border p-5">
						<h1 className="mb-1 text-subheading font-medium text-balance md:text-heading">{product.name}</h1>
						{reviewSummary && reviewSummary.reviewCount > 0 && (
							<a
								href="#reviews"
								className="mb-2 inline-flex items-center gap-2 text-label-sm transition-opacity hover:opacity-80"
							>
								<StarRow rating={reviewSummary.averageRating} />
								<span>{reviewSummary.averageRating.toFixed(1)}</span>
								<span className="text-muted-foreground underline-offset-4 hover:underline">
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
									variants={product.variants}
									product={{
										id: product.id,
										name: product.name,
										slug: product.slug,
										images: product.images,
									}}
									volumePricingTiers={product.volumePricingTiers}
									restockNotificationsEnabled={restockNotificationsEnabled}
								/>
							</Suspense>
						)}
					</div>

					<h2 className="sr-only">About this product</h2>
					{hasDetails && (
						<details className="group rounded-sm border border-border" open>
							<summary className={summaryClass}>
								Product details
								<PlusIcon
									aria-hidden
									className="h-5 w-5 transition-transform group-open:rotate-45"
									strokeWidth={1.5}
								/>
							</summary>
							<div className="space-y-3 px-4 pb-5 text-label font-light">
								{product.summary && <p className="whitespace-pre-line">{product.summary}</p>}
								{product.content && (
									<div className="prose prose-sm max-w-none">
										<TiptapRenderer content={product.content} />
									</div>
								)}
							</div>
						</details>
					)}
					<details className="group rounded-sm border border-border">
						<summary className={summaryClass}>
							Shipping &amp; returns
							<PlusIcon
								aria-hidden
								className="h-5 w-5 transition-transform group-open:rotate-45"
								strokeWidth={1.5}
							/>
						</summary>
						<div className="space-y-2 px-4 pb-5 text-label font-light">
							<p>Shipping options and costs for your address are shown at checkout, before you pay.</p>
						</div>
					</details>
					{product.category && (
						<Link
							href={`/category/${product.category.slug}`}
							className="flex items-center justify-between rounded-sm border border-border p-4 transition-colors hover:bg-secondary"
						>
							<span className="flex items-center gap-4">
								<span
									aria-hidden
									className="flex size-12 items-center justify-center rounded-xs bg-primary text-subheading font-medium uppercase text-primary-foreground"
								>
									{product.category.name.slice(0, 2)}
								</span>
								<span>
									<span className="block text-label-sm text-muted-foreground">More from</span>
									<span className="text-label-lg font-medium">{product.category.name}</span>
								</span>
							</span>
							<ChevronRightIcon aria-hidden className="h-5 w-5" strokeWidth={1.5} />
						</Link>
					)}
				</div>
			</div>

			{/* Reviews Section */}
			{reviews && <ProductReviews reviews={reviews} slug={slug} />}

			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</div>
	);
};
