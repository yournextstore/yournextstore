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
import { ShareLinks } from "@/app/product/[slug]/share-links";
import { PaymentMethods } from "@/components/payment-methods";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { commerce, getCanonicalUrl, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return (
		<div className="flex flex-col gap-6">
			<Skeleton className="aspect-square max-h-[623px] rounded-md bg-light" />
		</div>
	);
}

function PurchasePanelSkeleton() {
	return (
		<div className="space-y-8 md:space-y-10">
			<Skeleton className="h-9 w-40 bg-light" />
			<Skeleton className="h-20 w-40 bg-light" />
			<Skeleton className="h-10 w-32 rounded-md bg-light" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<section className="min-h-svh md:py-16 xl:py-20">
			<div className="shell">
				<div className="mx-auto grid w-10/12 grid-cols-1 gap-x-12 md:w-8/12 lg:w-11/12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
					<GallerySkeleton />
					<div className="space-y-8 py-6 lg:py-0">
						<Skeleton className="h-12 w-3/4 bg-light" />
						<PurchasePanelSkeleton />
					</div>
				</div>
			</div>
		</section>
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

	const shareUrl = `${getCanonicalUrl()}/product/${product.slug}`;
	const hasDescription = Boolean(product.content || product.summary);

	return (
		<div className="min-h-svh">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}
			<section className="md:py-16 xl:py-20">
				<div className="shell">
					<div className="mx-auto grid w-10/12 grid-cols-1 gap-x-12 md:w-8/12 lg:w-11/12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
						<Suspense fallback={<GallerySkeleton />}>
							<MediaGallery images={allImages} productName={product.name} variants={product.variants} />
						</Suspense>

						<div className="py-6 lg:py-0">
							<h1 className="mb-2 text-3xl md:mb-6 md:text-cp-h2">{product.name}</h1>
							{reviewSummary && reviewSummary.reviewCount > 0 && (
								<a
									href="#reviews"
									className="mb-4 inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
								>
									<StarRow rating={reviewSummary.averageRating} />
									<span className="font-medium">{reviewSummary.averageRating.toFixed(1)}</span>
									<span className="text-soft-text underline-offset-4 hover:underline">
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

							<div className="mt-8 flex flex-wrap items-center gap-3 md:mt-10">
								<h2 className="text-base font-bold md:text-cp-h5">Payment:</h2>
								<PaymentMethods />
							</div>

							<hr className="my-6 border-border" />

							<div className="flex flex-wrap items-center gap-3">
								<h2 className="text-base font-bold md:text-cp-h5">Share:</h2>
								<ShareLinks url={shareUrl} title={product.name} />
							</div>

							{product.category ? (
								<div className="mt-6 flex flex-wrap items-center gap-3">
									<h2 className="text-base font-bold md:text-cp-h5">Category:</h2>
									<Link
										href={`/category/${product.category.slug}`}
										className="rounded-md border border-border px-2 py-1 text-sm text-soft-text transition-colors hover:border-ink hover:text-ink"
									>
										{product.category.name}
									</Link>
								</div>
							) : null}
						</div>
					</div>
				</div>
			</section>

			{hasDescription && (
				<section>
					<div className="shell">
						<div className="mx-auto mt-12 w-10/12 lg:w-11/12">
							<div className="flex border-b-2 border-border">
								<h2 className="-mb-0.5 rounded-t-lg border-2 border-b-0 border-border bg-background px-8 py-2 text-base font-normal text-ink md:text-lg">
									Description
								</h2>
							</div>
							<div className="rounded-b-md border-x-2 border-b-2 border-border p-6">
								{product.content ? (
									<div className="prose max-w-none dark:prose-invert">
										<TiptapRenderer content={product.content} />
									</div>
								) : (
									<p className="whitespace-pre-line">{product.summary}</p>
								)}
							</div>
						</div>
					</div>
				</section>
			)}

			{/* Reviews Section */}
			{reviews && (
				<div className="shell">
					<ProductReviews reviews={reviews} slug={slug} />
				</div>
			)}

			{/* Related Products */}
			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</div>
	);
};
