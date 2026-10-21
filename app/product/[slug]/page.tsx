import { Star } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCartButton } from "@/app/product/[slug]/add-to-cart-button";
import { BundleBuilder } from "@/app/product/[slug]/bundle-builder";
import { MediaGallery } from "@/app/product/[slug]/media-gallery";
import { ProductPanels } from "@/app/product/[slug]/product-panels";
import { ProductReviews } from "@/app/product/[slug]/product-reviews";
import { RelatedProducts } from "@/app/product/[slug]/related-products";
import { Skeleton } from "@/components/ui/skeleton";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return (
		<Skeleton className="aspect-square rounded-sm bg-black/5 lg:col-span-7 lg:row-span-3 lg:row-start-1 lg:aspect-auto lg:min-h-[calc(100svh-84px)]" />
	);
}

function PurchasePanelSkeleton() {
	return (
		<div className="flex flex-col gap-2">
			<Skeleton className="h-4 w-40 rounded-sm bg-black/5" />
			<Skeleton className="h-4 w-24 rounded-sm bg-black/5" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div
			data-flush
			data-ground="paper"
			className="flex min-h-svh flex-col gap-3 px-3 pt-16 lg:grid lg:grid-cols-12 lg:gap-x-3 lg:pt-20"
		>
			<Skeleton className="h-[60px] w-3/4 rounded-sm bg-black/5 lg:col-span-5 lg:col-start-8 lg:row-start-1" />
			<GallerySkeleton />
		</div>
	);
}

function StarRow({ rating }: { rating: number }) {
	const rounded = Math.round(rating);
	return (
		<span className="flex gap-0.5" aria-hidden>
			{Array.from({ length: 5 }, (_, i) => (
				<Star key={i} className={cn("h-4 w-4", i < rounded ? "fill-current" : "fill-transparent")} />
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

	const panels = <ProductPanels product={product} />;
	const isBundle = product.type === "bundle" && Boolean(product.bundle?.groups?.length);

	return (
		<div data-flush data-ground="paper" data-bottom-bar={isBundle ? undefined : ""}>
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}

			{/* From 1024px the page fits the screen, like the original: photo on the left, the name at
			    the top right, the facts at the bottom of the column and the small photos under them. */}
			<div className="flex flex-col gap-3 px-3 pt-16 lg:grid lg:min-h-svh lg:grid-cols-12 lg:grid-rows-[auto_1fr_auto] lg:gap-y-0 lg:pt-20 lg:pb-1">
				<div className="text-heading leading-[1.25] lg:col-span-5 lg:col-start-8 lg:row-start-1">
					<h1 className="text-balance">{product.name}</h1>
					{product.category && (
						<p>
							<Link href={`/category/${product.category.slug}`} className="hover:underline">
								{product.category.name}
							</Link>
						</p>
					)}
					{reviewSummary && reviewSummary.reviewCount > 0 && (
						<a href="#reviews" className="mt-2 inline-flex items-center gap-2 text-label hover:underline">
							<StarRow rating={reviewSummary.averageRating} />
							{reviewSummary.averageRating.toFixed(1)} ({reviewSummary.reviewCount}{" "}
							{reviewSummary.reviewCount === 1 ? "review" : "reviews"})
						</a>
					)}
				</div>

				<div className="mt-5 mb-8 lg:col-span-5 lg:col-start-8 lg:row-start-2 lg:mt-12 lg:mb-11 lg:self-end">
					{/* Configurable bundle → group builder; otherwise the standard variant add-to-cart. */}
					{isBundle && product.bundle ? (
						<div className="flex flex-col gap-8">
							{product.summary && (
								<p className="max-w-[32rem] text-copy font-normal whitespace-pre-line">{product.summary}</p>
							)}
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
							<div className="relative grid grid-cols-2 gap-1">{panels}</div>
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
								panels={panels}
							/>
						</Suspense>
					)}
				</div>

				<Suspense fallback={<GallerySkeleton />}>
					<MediaGallery
						images={allImages}
						productName={product.name}
						variants={product.variants}
						className="lg:col-span-7 lg:row-span-3 lg:row-start-1 lg:min-h-[calc(100svh-84px)]"
						thumbsClassName="lg:col-span-5 lg:col-start-8 lg:row-start-3"
					/>
				</Suspense>
			</div>

			{/* Reviews Section */}
			{reviews && (
				<div className="card mx-1 mt-1 bg-white">
					<ProductReviews reviews={reviews} slug={slug} />
				</div>
			)}

			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</div>
	);
};
