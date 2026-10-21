import { ChevronDown, Star } from "lucide-react";
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
import { summaryParagraphs } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";
import { sentenceCase } from "@/lib/display";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return (
		<div className="flex flex-col gap-3">
			<Skeleton className="aspect-[4/5] rounded-2xl" />
			<div className="flex gap-2 p-1">
				{[0, 1, 2, 3].map((i) => (
					<Skeleton key={i} className="m-1 h-14 w-14 rounded-full" />
				))}
			</div>
		</div>
	);
}

function PurchasePanelSkeleton() {
	return (
		<div className="space-y-6">
			<Skeleton className="h-9 w-40" />
			<Skeleton className="h-16 w-32" />
			<Skeleton className="h-12 w-full rounded" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="kara-container min-h-svh py-4">
			<Skeleton className="mb-4 h-4 w-64" />
			<div className="rounded-2xl bg-card p-2 md:p-4 lg:grid lg:grid-cols-2 lg:gap-10">
				<GallerySkeleton />
				<div className="mt-6 space-y-6 lg:mt-0 lg:py-4">
					<Skeleton className="h-7 w-28 rounded-md" />
					<Skeleton className="h-12 w-3/4" />
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

	const paragraphs = summaryParagraphs(product.summary, product.name);

	return (
		<div className="min-h-svh">
			<div className="kara-container py-4">
				<JsonLdScript data={productJsonLd} />
				<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
				{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}
				<nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
					<ol className="flex flex-wrap items-center gap-1.5">
						<li>
							<Link href="/" className="hover:text-neutral-900">
								Home
							</Link>
						</li>
						<li aria-hidden="true">/</li>
						<li>
							<Link href="/products" className="hover:text-neutral-900">
								Products
							</Link>
						</li>
						{product.category && (
							<>
								<li aria-hidden="true">/</li>
								<li>
									<Link href={`/category/${product.category.slug}`} className="hover:text-neutral-900">
										{sentenceCase(product.category.name)}
									</Link>
								</li>
							</>
						)}
					</ol>
				</nav>
				<div className="rounded-2xl bg-card p-2 md:p-4 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
					<Suspense fallback={<GallerySkeleton />}>
						<MediaGallery images={allImages} productName={product.name} variants={product.variants} />
					</Suspense>

					<div className="mt-6 min-w-0 space-y-6 px-2 pb-2 lg:mt-0 lg:px-0 lg:py-4 lg:pr-4">
						<div className="space-y-4">
							{product.category && (
								<Link
									href={`/category/${product.category.slug}`}
									className="inline-block rounded-md bg-violet-soft px-4 py-1 text-sm font-semibold text-violet"
								>
									{sentenceCase(product.category.name)}
								</Link>
							)}
							<h1 className="text-balance text-3xl font-bold leading-tight text-black [overflow-wrap:anywhere] md:text-4xl">
								{product.name}
							</h1>
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

						{paragraphs.length > 0 && (
							<details open className="group rounded-lg bg-muted">
								<summary className="flex cursor-pointer list-none items-center justify-between px-2.5 py-2.5 [&::-webkit-details-marker]:hidden">
									<h2 className="text-sm font-semibold uppercase text-neutral-600">Product details</h2>
									<ChevronDown className="h-4 w-4 text-neutral-600 transition-transform group-open:rotate-180" />
								</summary>
								<div className="space-y-2 px-2.5 pb-3 text-sm leading-relaxed text-neutral-700">
									{paragraphs.map((paragraph, index) => (
										<p key={`${index}-${paragraph.slice(0, 12)}`}>{paragraph}</p>
									))}
								</div>
							</details>
						)}
					</div>
				</div>

				{product.content && (
					<section className="mt-4 rounded-2xl bg-card p-6 md:p-8">
						<h2 className="mb-4 text-xl font-bold text-black">About this product</h2>
						<div className="prose prose-sm max-w-none text-muted-foreground">
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
