import { Star } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCartButton } from "@/app/product/[slug]/add-to-cart-button";
import { BundleBuilder } from "@/app/product/[slug]/bundle-builder";
import { ProductPhotos } from "@/app/product/[slug]/product-photos";
import { ProductReviews } from "@/app/product/[slug]/product-reviews";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { displayName } from "@/lib/swag";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// The purchase panel reads useSearchParams (selected variant), so it needs a Suspense boundary
// to keep the rest of the page prerenderable. The skeletons keep the same three blocks.
function DetailsSkeleton({ heading }: { heading?: React.ReactNode }) {
	return (
		<>
			<div className="flex flex-col bg-swag-gray px-4 pt-4 pb-6 lg:sticky lg:top-0 lg:h-[calc(100svh-80px)] lg:px-[14px] lg:pt-[14px]">
				{heading ?? <Skeleton className="h-28 w-3/4 bg-black/10" />}
				<Skeleton className="mt-2 h-12 w-40 bg-black/10" />
			</div>
			<div className="sticky bottom-[var(--dock-h)] z-30 h-10 bg-swag-green lg:col-span-2" />
		</>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="grid min-h-svh grid-cols-1 lg:grid-cols-2">
			<div className="halftone aspect-[4/5] bg-white lg:aspect-auto lg:min-h-svh" />
			<DetailsSkeleton />
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

	const heading = (
		<div>
			{product.category && (
				<Link
					href={`/category/${product.category.slug}`}
					className="mb-2 inline-block bg-black px-1 text-t14 text-white uppercase hover:bg-swag-blue"
				>
					{displayName(product.category.name)}
				</Link>
			)}
			<h1 className="font-sans text-t30 wrap-break-word sm:text-t56">{product.name}</h1>
			{reviewSummary && reviewSummary.reviewCount > 0 && (
				<a href="#reviews" className="mt-2 inline-flex items-center gap-2 text-t14 uppercase hover:underline">
					<StarRow rating={reviewSummary.averageRating} />
					{reviewSummary.averageRating.toFixed(1)} ({reviewSummary.reviewCount}{" "}
					{reviewSummary.reviewCount === 1 ? "review" : "reviews"})
				</a>
			)}
		</div>
	);

	return (
		<div className="min-h-svh">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}
			<div className="grid grid-cols-1 lg:grid-cols-2">
				<ProductPhotos images={allImages} productName={product.name} />
				{product.type === "bundle" && product.bundle?.groups?.length ? (
					<div className="bg-swag-gray px-4 py-4 lg:px-[14px]">
						{heading}
						<div className="mt-8">
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
					</div>
				) : (
					<Suspense fallback={<DetailsSkeleton heading={heading} />}>
						<AddToCartButton
							heading={heading}
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

			{product.content && (
				<section className="border-t border-black bg-white px-4 py-12 lg:px-[14px]">
					<h2 className="mb-6 text-t14 uppercase">Details</h2>
					<div className="prose prose-sm max-w-3xl">
						<TiptapRenderer content={product.content} />
					</div>
				</section>
			)}

			{reviews && <ProductReviews reviews={reviews} slug={slug} />}
		</div>
	);
};
