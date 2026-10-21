import { ChevronDown, ChevronRight, Star } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCartButton } from "@/app/product/[slug]/add-to-cart-button";
import { BundleBuilder } from "@/app/product/[slug]/bundle-builder";
import { MediaGallery } from "@/app/product/[slug]/media-gallery";
import { ProductPrice } from "@/app/product/[slug]/product-price";
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
	return <Skeleton className="aspect-[4/5] rounded-2xl bg-contrast-100" />;
}

function PurchasePanelSkeleton() {
	return (
		<div className="flex gap-2">
			<Skeleton className="h-12 w-28 rounded-lg bg-contrast-100" />
			<Skeleton className="h-12 w-56 rounded-full bg-contrast-100" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="container-soul min-h-svh py-10 sm:py-14 lg:py-20">
			<Skeleton className="mb-6 h-4 w-48 bg-contrast-100" />
			<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-x-12">
				<GallerySkeleton />
				<div className="space-y-4">
					<Skeleton className="h-10 w-3/4 bg-contrast-100" />
					<Skeleton className="h-7 w-24 bg-contrast-100" />
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
					className={cn(
						"size-4",
						i < rounded ? "fill-foreground text-foreground" : "fill-none text-foreground",
					)}
					strokeWidth={1}
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

	const variant = product.variants[0];
	const dimensions = variant
		? [variant.width, variant.height, variant.depth].filter((value) => value !== null && value !== undefined)
		: [];
	const specifications = [
		...(product.category ? [{ label: "Category", value: product.category.name }] : []),
		...(variant?.sku ? [{ label: "SKU", value: variant.sku }] : []),
		...(dimensions.length === 3 ? [{ label: "Dimensions", value: `${dimensions.join(" × ")} cm` }] : []),
		...(variant?.weight ? [{ label: "Weight", value: `${variant.weight} g` }] : []),
		{
			label: "Availability",
			value: product.variants.some((v) => v.stock !== 0) ? "In stock" : "Out of stock",
		},
	];

	return (
		<div className="container-soul py-10 sm:py-14 lg:py-20">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}
			<nav aria-label="Breadcrumb" className="mb-6">
				<ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
					<li>
						<Link href="/" className="font-medium text-contrast-500 hover:text-foreground">
							Home
						</Link>
					</li>
					<li aria-hidden="true" className="text-contrast-400">
						<ChevronRight className="size-4" strokeWidth={1.5} />
					</li>
					{product.category ? (
						<li>
							<Link
								href={`/category/${product.category.slug}`}
								className="font-medium text-contrast-500 hover:text-foreground"
							>
								{product.category.name}
							</Link>
						</li>
					) : (
						<li>
							<Link href="/products" className="font-medium text-contrast-500 hover:text-foreground">
								Shop All
							</Link>
						</li>
					)}
					<li aria-hidden="true" className="text-contrast-400">
						<ChevronRight className="size-4" strokeWidth={1.5} />
					</li>
					<li>
						<span aria-current="page" className="font-medium">
							{product.name}
						</span>
					</li>
				</ol>
			</nav>
			{/* Phones read title, price, photographs, then the form (the original's order); from md the
			    gallery takes the left column and the details stack on the right. */}
			<div className="grid grid-cols-1 items-start gap-x-8 md:grid-cols-2 md:grid-rows-[auto_1fr] lg:gap-x-12">
				<div className="md:col-start-2 md:row-start-1">
					<h1 className="mt-2 mb-3 text-2xl leading-none sm:mb-4 sm:text-3xl lg:text-4xl">{product.name}</h1>
					{reviewSummary && reviewSummary.reviewCount > 0 && (
						<a href="#reviews" className="inline-flex items-center gap-2 text-xs">
							<StarRow rating={reviewSummary.averageRating} />
							<span className="font-medium">{reviewSummary.averageRating.toFixed(1)}</span>
							<span className="border-l border-contrast-200 pl-2 text-contrast-500 underline-offset-4 hover:underline">
								{reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"}
							</span>
						</a>
					)}
					<Suspense fallback={<Skeleton className="my-3 h-8 w-24 bg-contrast-100" />}>
						<ProductPrice variants={product.variants} />
					</Suspense>
				</div>

				<div className="mt-5 mb-8 md:col-start-1 md:row-span-2 md:row-start-1 md:my-0">
					<Suspense fallback={<GallerySkeleton />}>
						<MediaGallery images={allImages} productName={product.name} variants={product.variants} />
					</Suspense>
				</div>

				<div className="md:col-start-2 md:row-start-2">
					<div className="mt-2 mb-8 md:mt-6">
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
					</div>

					{(product.summary || product.content) && (
						<div className="border-t border-contrast-100 py-8">
							{product.summary && <p className="leading-relaxed whitespace-pre-line">{product.summary}</p>}
							{product.content && (
								<div className="prose prose-sm max-w-none [&:not(:first-child)]:mt-4">
									<TiptapRenderer content={product.content} />
								</div>
							)}
						</div>
					)}

					<details className="group border-t border-contrast-100" open>
						<summary className="flex cursor-pointer list-none items-center justify-between gap-8 py-3 font-mono text-sm uppercase text-contrast-500 transition-colors hover:text-foreground md:py-4 [&::-webkit-details-marker]:hidden">
							Specifications
							<ChevronDown className="size-5 transition-transform group-open:rotate-180" strokeWidth={1.5} />
						</summary>
						<dl className="pb-4 text-sm">
							{specifications.map((spec) => (
								<div
									key={spec.label}
									className="grid grid-cols-2 gap-4 border-b border-contrast-100 py-2.5 last:border-0"
								>
									<dt className="font-semibold">{spec.label}</dt>
									<dd>{spec.value}</dd>
								</div>
							))}
						</dl>
					</details>
				</div>
			</div>

			{/* Related Products */}
			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />

			{/* Reviews Section */}
			{reviews && <ProductReviews reviews={reviews} slug={slug} />}
		</div>
	);
};
