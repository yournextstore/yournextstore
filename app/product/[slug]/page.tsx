import { ChevronLeft, Star } from "lucide-react";
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
import { displayName } from "@/lib/display";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function ProductPageSkeleton() {
	return (
		<div className="wrapper min-h-svh py-6">
			<Skeleton className="mb-6 h-5 w-36" />
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,488px)_minmax(0,1fr)_280px] lg:gap-12">
				<Skeleton className="aspect-square rounded-lg" />
				<div className="space-y-4">
					<Skeleton className="h-10 w-3/4" />
					<Skeleton className="h-10 w-28 rounded-full" />
				</div>
				<Skeleton className="h-56 rounded-lg" />
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
					className={cn("h-4 w-4", i < rounded ? "fill-accent text-accent" : "fill-muted text-muted")}
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

	const name = displayName(product.name);
	const hasDescription = Boolean(product.summary || product.content);

	return (
		<div className="wrapper min-h-svh py-6">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}
			<Link
				href={product.category ? `/category/${product.category.slug}` : "/products"}
				className="mb-5 inline-flex items-center gap-1.5 text-[15px] text-muted-foreground transition-colors hover:text-foreground"
			>
				<ChevronLeft aria-hidden="true" className="size-4" />
				Back to catalog
			</Link>
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,488px)_minmax(0,1fr)_280px] lg:grid-rows-[auto_auto_1fr] lg:gap-x-12 lg:gap-y-6">
				<Suspense fallback={<Skeleton className="aspect-square rounded-lg lg:row-span-3 lg:self-start" />}>
					<MediaGallery images={allImages} productName={product.name} variants={product.variants} />
				</Suspense>

				<div className="space-y-3 lg:col-start-2 lg:row-start-1">
					<h1 className="font-display text-3xl font-bold text-foreground text-balance lg:text-4xl">{name}</h1>
					{reviewSummary && reviewSummary.reviewCount > 0 && (
						<a
							href="#reviews"
							className="inline-flex items-center gap-2 text-[15px] text-muted-foreground transition-opacity hover:opacity-80"
						>
							<StarRow rating={reviewSummary.averageRating} />
							{reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"}
						</a>
					)}
				</div>

				{/* Configurable bundle → group builder; otherwise the standard variant add-to-cart.
				    The add-to-cart renders two grid items: options (middle) and the buy box (right). */}
				{product.type === "bundle" && product.bundle?.groups?.length ? (
					<div className="lg:col-span-2 lg:col-start-2 lg:row-start-2">
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
					<Suspense
						fallback={
							<>
								<Skeleton className="h-10 w-28 rounded-full lg:col-start-2 lg:row-start-2" />
								<Skeleton className="h-56 rounded-lg lg:col-start-3 lg:row-span-3 lg:row-start-1" />
							</>
						}
					>
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

				{hasDescription && (
					<section className="lg:col-start-2 lg:row-start-3">
						<h2 className="mb-3 font-display text-xl font-bold text-foreground">Description</h2>
						{product.summary && (
							<p className="leading-relaxed whitespace-pre-line text-muted-foreground">{product.summary}</p>
						)}
						{product.content && (
							<div className="prose prose-sm mt-4 max-w-none text-muted-foreground dark:prose-invert">
								<TiptapRenderer content={product.content} />
							</div>
						)}
					</section>
				)}
			</div>

			{/* Reviews Section */}
			{reviews && <ProductReviews reviews={reviews} slug={slug} />}

			{/* Related Products */}
			<div className="-mx-4 lg:-mx-11">
				<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
			</div>
		</div>
	);
};
