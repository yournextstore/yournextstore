import { ChevronDown, Star } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCartButton } from "@/app/product/[slug]/add-to-cart-button";
import { BundleBuilder } from "@/app/product/[slug]/bundle-builder";
import { MediaGallery } from "@/app/product/[slug]/media-gallery";
import { ProductReviews } from "@/app/product/[slug]/product-reviews";
import { RelatedProducts } from "@/app/product/[slug]/related-products";
import { Crumbs } from "@/components/crumbs";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { commerce, meGetCached } from "@/lib/commerce";
import { sentenceCase } from "@/lib/display";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return (
		<div className="lg:sticky lg:top-20 lg:grid lg:grid-cols-[88px_minmax(0,1fr)] lg:gap-5 lg:self-start xl:grid-cols-[96px_minmax(0,1fr)]">
			<div className="hidden flex-col gap-2 lg:flex">
				{Array.from({ length: 4 }, (_, i) => (
					<Skeleton key={`t-${i}`} className="aspect-square rounded-lg" />
				))}
			</div>
			<Skeleton className="-mx-[clamp(20px,5vw,48px)] aspect-square rounded-none sm:mx-0 sm:aspect-[3/4] sm:rounded-lg" />
		</div>
	);
}

function PurchasePanelSkeleton() {
	return (
		<div className="space-y-5">
			<Skeleton className="h-9 w-40" />
			<Skeleton className="h-7 w-24" />
			<Skeleton className="h-12 w-full rounded-lg" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="page-width min-h-svh pb-16">
			<div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-12">
				<div className="order-2 h-11 lg:order-none lg:col-span-2" />
				<div className="order-1 lg:order-none">
					<GallerySkeleton />
				</div>
				<div className="order-3 mt-2 space-y-5 lg:order-none lg:mt-0">
					<Skeleton className="h-10 w-3/4" />
					<PurchasePanelSkeleton />
				</div>
			</div>
		</div>
	);
}

function PdpSection({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<details open className="group border-b border-border">
			<summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 [&::-webkit-details-marker]:hidden">
				<h2 className="ed-label m-0 text-foreground">{title}</h2>
				<ChevronDown
					className="h-4 w-4 shrink-0 rotate-180 text-muted-foreground transition-transform group-open:rotate-0"
					aria-hidden
				/>
			</summary>
			<div className="pb-4">{children}</div>
		</details>
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

	// The original shows a one-line subtitle under the title and the long copy in an open
	// "Product description" section; a store's summary often holds both, first line first.
	const summaryParts = (product.summary ?? "")
		.split(/\n+/)
		.map((line) => line.trim())
		.filter(Boolean);
	const subtitle = summaryParts[0] && summaryParts[0].length <= 160 ? summaryParts[0] : null;
	const descriptionParagraphs = subtitle ? summaryParts.slice(1) : summaryParts;

	const singleSku = product.variants.length === 1 ? (product.variants[0]?.sku ?? null) : null;
	const specs = [
		...(singleSku ? [{ label: "SKU", value: singleSku }] : []),
		...(product.category ? [{ label: "Category", value: sentenceCase(product.category.name) }] : []),
		...(product.variants.length > 1
			? [{ label: "Options", value: `${product.variants.length} variants` }]
			: []),
	];

	return (
		<div className="page-width min-h-svh pb-16">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}
			<div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
				{/* Phones show the photograph first and the trail under it, as in the original. */}
				<div className="order-2 min-w-0 lg:order-none lg:col-span-2">
					<Crumbs
						items={[
							...(product.category
								? [{ label: sentenceCase(product.category.name), href: `/category/${product.category.slug}` }]
								: []),
							{ label: product.name },
						]}
					/>
				</div>

				<div className="order-1 min-w-0 lg:order-none">
					<Suspense fallback={<GallerySkeleton />}>
						<MediaGallery images={allImages} productName={product.name} variants={product.variants} />
					</Suspense>
				</div>

				<div className="order-3 min-w-0 space-y-5 lg:order-none">
					<div className="space-y-2">
						<h1 className="ed-display m-0 text-display-pdp text-balance wrap-break-word">{product.name}</h1>
						{subtitle && <p className="m-0 text-[0.9375rem] text-muted-foreground">{subtitle}</p>}
						{reviewSummary && reviewSummary.reviewCount > 0 && (
							<a
								href="#reviews"
								className="inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
							>
								<StarRow rating={reviewSummary.averageRating} />
								<span className="font-medium">{reviewSummary.averageRating.toFixed(1)}</span>
								<span className="text-muted-foreground underline-offset-4 hover:underline">
									({reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"})
								</span>
							</a>
						)}
					</div>

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

					{/* The original's two open accordions under the buy box. */}
					<div className="border-t border-border">
						{specs.length > 0 && (
							<PdpSection title="Product specifications">
								<dl className="m-0 grid gap-2.5">
									{specs.map((spec) => (
										<div key={spec.label}>
											<dt className="text-xs text-muted-foreground uppercase">{spec.label}</dt>
											<dd className="m-0 text-sm font-medium break-all">{spec.value}</dd>
										</div>
									))}
								</dl>
							</PdpSection>
						)}
						{(product.content || descriptionParagraphs.length > 0) && (
							<PdpSection title="Product description">
								<div className="prose prose-sm max-w-none text-muted-foreground">
									{descriptionParagraphs.map((paragraph, index) => (
										<p key={`p-${index}`}>{paragraph}</p>
									))}
									{product.content && <TiptapRenderer content={product.content} />}
								</div>
							</PdpSection>
						)}
					</div>
				</div>
			</div>

			{/* Reviews Section */}
			{reviews && <ProductReviews reviews={reviews} slug={slug} />}

			{/* Related Products (no Suspense of its own; see related-products.tsx) */}
			<div className="mt-14">
				<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
			</div>
		</div>
	);
};
