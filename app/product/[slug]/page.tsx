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
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { accentFor } from "@/lib/accent";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return <Skeleton className="aspect-[4/5] w-full rounded-lg" />;
}

function PurchasePanelSkeleton() {
	return (
		<div className="flex items-center justify-between pt-3">
			<Skeleton className="h-8 w-24" />
			<Skeleton className="h-8 w-28 rounded" />
		</div>
	);
}

// Same split as the page, so nothing moves when the product streams in.
function ProductPageSkeleton() {
	return (
		<div data-split className="min-h-svh md:flex md:min-h-screen md:items-center">
			<div className="flex w-full flex-col-reverse gap-y-3 md:flex-row md:gap-x-10 md:gap-y-0">
				<div className="py-6 md:flex md:min-h-screen md:w-1/2 md:items-end md:py-12">
					<div className="w-full space-y-3">
						<Skeleton className="h-10 w-3/4 md:h-14" />
						<PurchasePanelSkeleton />
					</div>
				</div>
				<div className="md:w-1/2 md:py-12">
					<GallerySkeleton />
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
					className={cn("h-4 w-4", i < rounded ? "fill-ink text-ink" : "fill-white-rock text-white-rock")}
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

	return (
		<>
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}
			{/* The original's split screen: details pinned to the bottom of the left column under
			    the logotype, photographs stacked down the right. Phones get photos first. */}
			<div data-split className="md:flex md:min-h-screen md:items-center">
				<div className="flex w-full flex-col-reverse gap-y-3 md:flex-row md:gap-x-10 md:gap-y-0">
					<div className="md:sticky md:top-0 md:flex md:min-h-screen md:w-1/2 md:items-end md:self-start">
						<div className="w-full py-6 md:py-12">
							{product.category && (
								<Link
									href={`/category/${product.category.slug}`}
									className="mb-2 inline-block text-sm text-muted-foreground hover:italic"
								>
									{product.category.name}
								</Link>
							)}
							<h1 className="font-serif text-2xl font-medium italic text-balance md:text-4xl lg:text-5xl">
								{product.name}
							</h1>
							{reviewSummary && reviewSummary.reviewCount > 0 && (
								<a
									href="#reviews"
									className="mt-2 inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
								>
									<StarRow rating={reviewSummary.averageRating} />
									<span>{reviewSummary.averageRating.toFixed(1)}</span>
									<span className="text-muted-foreground underline-offset-4 hover:underline">
										({reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"})
									</span>
								</a>
							)}

							{/* Configurable bundle → group builder; otherwise the standard variant add-to-cart. */}
							{product.type === "bundle" && product.bundle?.groups?.length ? (
								<div className="pt-6">
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
										variants={product.variants}
										product={{
											id: product.id,
											name: product.name,
											slug: product.slug,
											images: product.images,
										}}
										summary={product.summary}
										volumePricingTiers={product.volumePricingTiers}
										restockNotificationsEnabled={restockNotificationsEnabled}
										accentClassName={accentFor(product.slug)}
									/>
								</Suspense>
							)}

							{product.content && (
								<div className="prose prose-sm max-w-none pt-6 lg:prose-base">
									<TiptapRenderer content={product.content} />
								</div>
							)}
						</div>
					</div>

					<div className="pt-3 md:z-40 md:w-1/2 md:py-12">
						<Suspense fallback={<GallerySkeleton />}>
							<MediaGallery images={allImages} productName={product.name} variants={product.variants} />
						</Suspense>
					</div>
				</div>
			</div>

			{reviews && <ProductReviews reviews={reviews} slug={slug} />}

			<div className="py-3 md:py-4 lg:py-8">
				<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
			</div>
		</>
	);
};
