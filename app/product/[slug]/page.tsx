import { Star } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCartButton } from "@/app/product/[slug]/add-to-cart-button";
import { BundleBuilder } from "@/app/product/[slug]/bundle-builder";
import { MediaGallery } from "@/app/product/[slug]/media-gallery";
import { ProductReviews } from "@/app/product/[slug]/product-reviews";
import { RelatedProducts } from "@/app/product/[slug]/related-products";
import { HullMarquee } from "@/components/sections/hull-marquee";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return <Skeleton className="mx-auto aspect-square w-full max-w-xl rounded-none" />;
}

function PurchasePanelSkeleton() {
	return (
		<>
			<div className="m-auto w-full max-w-xl p-4 md:p-8">
				<div className="mb-8 border-b border-border pb-2">
					<Skeleton className="h-10 w-2/3 rounded-none" />
				</div>
				<Skeleton className="h-24 w-full rounded-none" />
			</div>
			<div className="hull-dots mt-4 h-[82px] border-t border-border md:h-[114px]" />
		</>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="min-h-svh">
			<div className="grid border-b border-border md:grid-cols-2 md:gap-px md:bg-foreground">
				<div className="border-b border-border bg-background sm:p-8 md:border-none lg:p-24">
					<GallerySkeleton />
				</div>
				<div className="flex flex-col bg-background">
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

	return (
		<div className="min-h-svh">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}

			{/* The original's product module: gallery and details split by a 1px ink gutter. */}
			<section className="border-b border-border">
				<div className="relative grid md:grid-cols-2 md:gap-px md:bg-foreground">
					<div className="relative mb-12 border-b border-border bg-background sm:p-8 md:mb-0 md:border-none lg:p-24">
						<Suspense fallback={<GallerySkeleton />}>
							<MediaGallery images={allImages} productName={product.name} variants={product.variants} />
						</Suspense>
					</div>

					<div className="flex flex-col bg-background">
						{product.type === "bundle" && product.bundle?.groups?.length ? (
							<div className="m-auto w-full max-w-xl p-4 md:p-8">
								<h1 className="mb-8 border-b border-border pb-2 text-h3 leading-[1.35]">{product.name}</h1>
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
									name={product.name}
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
						{reviewSummary && reviewSummary.reviewCount > 0 && (
							<a
								href="#reviews"
								className="flex items-center justify-center gap-2 border-t border-border p-4 text-nav"
							>
								<StarRow rating={reviewSummary.averageRating} />
								<span className="font-semibold">{reviewSummary.averageRating.toFixed(1)}</span>
								<span className="underline underline-offset-4">
									{reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"}
								</span>
							</a>
						)}
					</div>
				</div>
			</section>

			{/* The name on a loop, as the original runs it under every product. */}
			<HullMarquee duration={40} className="border-b border-border">
				{Array.from({ length: 6 }, (_, i) => (
					<span
						key={`m-${i}`}
						aria-hidden={i > 0}
						className="block p-8 text-h1 leading-none whitespace-nowrap"
					>
						{product.name}
					</span>
				))}
			</HullMarquee>

			{product.content && (
				<section className="border-b border-border px-4 py-12 md:p-8 md:py-16 lg:py-20">
					<div className="mx-auto max-w-2xl">
						<h2 className="mb-6 text-h4">The details</h2>
						<div className="prose max-w-none text-body dark:prose-invert">
							<TiptapRenderer content={product.content} />
						</div>
					</div>
				</section>
			)}

			{reviews && <ProductReviews reviews={reviews} slug={slug} />}

			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</div>
	);
};
