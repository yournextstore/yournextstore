import { ArrowLeft, Star } from "lucide-react";
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
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

const PAGE = "min-h-svh px-4 pt-4 pb-12 md:px-8 lg:px-[100px] lg:pt-5 lg:pb-[100px]";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return (
		<>
			<div className="order-2 flex shrink-0 gap-[5px] bg-white p-2.5 md:order-none md:w-[150px] md:flex-col">
				<div className="h-[100px] w-[100px] border border-border md:w-full" />
				<div className="h-[100px] w-[100px] border border-border md:w-full" />
			</div>
			<div className="order-1 h-[300px] w-full bg-[#f8f8f8] sm:h-[400px] md:order-none md:h-auto md:min-h-[440px] md:w-auto md:grow md:basis-[400px]" />
		</>
	);
}

function PurchasePanelSkeleton({ hasOptions }: { hasOptions: boolean }) {
	return (
		<div>
			<div className="h-12" />
			<div className="sal-divider my-6" />
			{hasOptions && <div className="h-[170px]" />}
			<div className="mt-6 h-10 w-36 bg-secondary" />
			<div className="mt-4 h-[41px] w-32 bg-primary/80" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className={PAGE}>
			<div className="lg:mx-[50px]">
				<div className="mb-4 h-7 w-36 bg-secondary" />
				<div className="flex flex-col border border-border bg-white md:flex-row">
					<GallerySkeleton />
					<div className="order-3 w-full p-4 pb-8 md:order-none md:w-[440px] md:shrink-0 md:p-8 xl:w-[500px]">
						<div className="h-4 w-16 bg-secondary" />
						<div className="mt-2 h-10 w-1/2 bg-secondary" />
						<PurchasePanelSkeleton hasOptions />
					</div>
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

	const hasOptions = product.variants.length > 1;

	return (
		<div className={PAGE}>
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}
			<div className="lg:mx-[50px]">
				<Link
					href="/products"
					className="mb-4 inline-flex items-center gap-2 text-[1.17rem] font-bold text-black hover:underline"
				>
					<ArrowLeft aria-hidden="true" className="h-4 w-4" strokeWidth={2.5} />
					Back to shop
				</Link>

				{/* The original's product "modal": one white bordered panel with thumbnails, picture and details. */}
				<div className="flex flex-col border border-border bg-white md:flex-row">
					<Suspense fallback={<GallerySkeleton />}>
						<MediaGallery images={allImages} productName={product.name} variants={product.variants} />
					</Suspense>

					<div className="order-3 w-full p-4 pb-8 md:order-none md:w-[440px] md:shrink-0 md:p-8 xl:w-[500px]">
						{product.category ? (
							<Link
								href={`/category/${product.category.slug}`}
								className="text-sal-sm font-bold text-muted-foreground hover:underline"
							>
								{product.category.name}
							</Link>
						) : (
							<span className="block h-[18px]" />
						)}
						<h1 className="mt-1 text-[2rem] font-bold leading-tight text-foreground">{product.name}</h1>
						{reviewSummary && reviewSummary.reviewCount > 0 && (
							<a href="#reviews" className="mt-2 inline-flex items-center gap-2 text-sal-sm hover:opacity-80">
								<StarRow rating={reviewSummary.averageRating} />
								<span>{reviewSummary.averageRating.toFixed(1)}</span>
								<span className="text-muted-foreground">
									({reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"})
								</span>
							</a>
						)}

						{product.type === "bundle" && product.bundle?.groups?.length ? (
							<div className="mt-6">
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
							<Suspense fallback={<PurchasePanelSkeleton hasOptions={hasOptions} />}>
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
				</div>

				{product.content && (
					<section className="mt-5 border border-border bg-white p-4 md:p-8">
						<h2 className="mb-4 text-sal-lg font-bold">Product details</h2>
						<div className="prose prose-sm max-w-none font-normal">
							<TiptapRenderer content={product.content} />
						</div>
					</section>
				)}

				{reviews && <ProductReviews reviews={reviews} slug={slug} />}
			</div>

			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</div>
	);
};
