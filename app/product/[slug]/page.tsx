import { Plus, Star } from "lucide-react";
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

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return <div className="aspect-[9/10] animate-pulse bg-sand lg:sticky lg:top-[5.5rem] lg:self-start" />;
}

function PurchasePanelSkeleton() {
	return (
		<div className="space-y-8">
			<Skeleton className="h-16 w-full bg-sand" />
			<Skeleton className="h-12 w-full rounded-lg bg-sand" />
			<Skeleton className="h-14 w-full rounded-lg bg-sand" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="min-h-svh lg:grid lg:grid-cols-2">
			<GallerySkeleton />
			<div className="space-y-6 px-6 pt-8 lg:max-w-[40rem] lg:pl-20 lg:pr-14 lg:pt-12">
				<Skeleton className="h-5 w-40 bg-sand" />
				<Skeleton className="h-10 w-3/4 bg-sand" />
				<PurchasePanelSkeleton />
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
					className={cn("h-4 w-4", i < rounded ? "fill-ink text-ink" : "fill-muted text-muted")}
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

	const kicker = product.category
		? { href: `/category/${product.category.slug}`, label: product.category.name }
		: product.productCollections[0]?.collection
			? {
					href: `/collection/${product.productCollections[0].collection.slug}`,
					label: product.productCollections[0].collection.name,
				}
			: null;

	return (
		<div className="min-h-svh">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}
			<div className="mx-auto max-w-[120rem] lg:grid lg:grid-cols-2">
				{/* Left: the full-bleed photograph (sticky on desktop) */}
				<Suspense fallback={<GallerySkeleton />}>
					<MediaGallery images={allImages} productName={product.name} variants={product.variants} />
				</Suspense>

				{/* Right: Product Details */}
				<div className="px-6 pt-6 lg:max-w-[40rem] lg:pl-20 lg:pr-14 lg:pt-12">
					{kicker && (
						<Link
							href={kicker.href}
							className="caps text-copy font-semibold text-[#6f6880] transition-colors hover:text-ink"
						>
							{kicker.label}
						</Link>
					)}
					<h1 className="mt-2 text-title font-semibold text-ink text-balance">{product.name}</h1>
					{reviewSummary && reviewSummary.reviewCount > 0 && (
						<a
							href="#reviews"
							className="mt-2 inline-flex items-center gap-2 text-copy transition-opacity hover:opacity-80"
						>
							<StarRow rating={reviewSummary.averageRating} />
							<span className="font-semibold text-ink">{reviewSummary.averageRating.toFixed(1)}</span>
							<span className="text-plum underline-offset-4 hover:underline">
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
								/>
							</Suspense>
						)}
					</div>

					{/* Horizon's sand accordion with the plus sign: the full description. */}
					{product.content && (
						<details className="group mt-6 rounded-lg bg-sand px-4 open:pb-4">
							<summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 text-copy font-semibold text-ink [&::-webkit-details-marker]:hidden">
								Product details
								<Plus className="h-4 w-4 transition-transform group-open:rotate-45" aria-hidden />
							</summary>
							<div className="prose prose-sm max-w-none text-plum">
								<TiptapRenderer content={product.content} />
							</div>
						</details>
					)}
				</div>
			</div>

			{/* Reviews Section */}
			{reviews && (
				<div className="px-6 lg:px-14">
					<ProductReviews reviews={reviews} slug={slug} />
				</div>
			)}

			{/* Related Products */}
			<div className="mt-8 lg:mt-14">
				<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
			</div>
		</div>
	);
};
