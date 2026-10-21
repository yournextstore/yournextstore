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
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { summaryParagraphs } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { capitalize, cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return (
		<div className="mt-6">
			<div className="mx-auto max-w-2xl sm:px-6 lg:hidden">
				<Skeleton className="aspect-[4/5] rounded-none sm:rounded-lg" />
			</div>
			<div className="mx-auto hidden max-w-7xl grid-cols-3 gap-x-8 px-8 lg:grid">
				<Skeleton className="aspect-[3/4] rounded-lg" />
				<Skeleton className="aspect-[3/4] rounded-lg" />
				<Skeleton className="aspect-[3/4] rounded-lg" />
			</div>
		</div>
	);
}

function PurchasePanelSkeleton() {
	return (
		<div className="space-y-10">
			<Skeleton className="h-9 w-40" />
			<Skeleton className="h-12 w-full rounded-md" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="min-h-svh pt-10 pb-16 sm:pt-16 sm:pb-24">
			<div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
				<Skeleton className="h-5 w-64" />
			</div>
			<GallerySkeleton />
			<div className="mx-auto max-w-2xl px-4 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8 lg:pt-16">
				<div className="lg:col-span-2 lg:pr-8">
					<Skeleton className="h-9 w-3/4" />
				</div>
				<div className="mt-4 lg:mt-0">
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

	const crumbs = [
		{ href: "/products", label: "Shop" },
		...(product.category
			? [{ href: `/category/${product.category.slug}`, label: capitalize(product.category.name) }]
			: []),
	];
	const paragraphs = summaryParagraphs(product.summary, product.name);

	return (
		<div className="min-h-svh bg-white pt-10 pb-16 sm:pt-16 sm:pb-24">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}

			<div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
				<nav aria-label="Breadcrumb">
					<ol className="flex flex-wrap items-center gap-y-1 space-x-2">
						{crumbs.map((crumb) => (
							<li key={crumb.href}>
								<div className="flex items-center text-sm">
									<Link href={crumb.href} className="font-medium text-gray-500 hover:text-gray-900">
										{crumb.label}
									</Link>
									<svg
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
										className="ml-2 h-5 w-5 shrink-0 text-gray-300"
									>
										<path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
									</svg>
								</div>
							</li>
						))}
						<li className="text-sm">
							<span aria-current="page" className="font-medium text-gray-900">
								{product.name}
							</span>
						</li>
					</ol>
				</nav>
			</div>

			<Suspense fallback={<GallerySkeleton />}>
				<MediaGallery images={allImages} productName={product.name} variants={product.variants} />
			</Suspense>

			{/* Product info: Penny's three-column grid, title and description left of a ruled line. */}
			<div className="mx-auto max-w-2xl px-4 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:px-8 lg:pt-16">
				<div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
					<h1 className="text-2xl font-extrabold tracking-tight wrap-break-word text-gray-900 sm:text-3xl">
						{product.name}
					</h1>
					{reviewSummary && reviewSummary.reviewCount > 0 && (
						<a href="#reviews" className="mt-3 inline-flex items-center gap-2 text-sm hover:opacity-80">
							<StarRow rating={reviewSummary.averageRating} />
							<span className="text-gray-500">
								{reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"}
							</span>
						</a>
					)}
				</div>

				<div className="mt-4 lg:row-span-3 lg:mt-0">
					<h2 className="sr-only">Product information</h2>
					{/* Configurable bundle → group builder; otherwise the standard variant add-to-cart. */}
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

				<div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pr-8 lg:pb-16">
					<h2 className="sr-only">Description</h2>
					{paragraphs.length > 0 && (
						<div className="space-y-4 text-base text-gray-700">
							{paragraphs.map((paragraph) => (
								<p key={paragraph}>{paragraph}</p>
							))}
						</div>
					)}
					{product.content && (
						<div className="prose prose-sm mt-6 max-w-none text-gray-700">
							<TiptapRenderer content={product.content} />
						</div>
					)}
				</div>
			</div>

			<div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
				{reviews && <ProductReviews reviews={reviews} slug={slug} />}
				<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
			</div>
		</div>
	);
};
