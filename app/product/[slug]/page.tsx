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
import { type ProductTab, ProductTabs } from "@/app/product/[slug]/product-tabs";
import { RelatedProducts } from "@/app/product/[slug]/related-products";
import { Crumbs } from "@/components/listing";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return (
		<div className="aspect-[29/34] max-h-[25rem] w-full animate-pulse bg-secondary md:aspect-[29/20] md:max-h-[33.75rem]" />
	);
}

function PurchasePanelSkeleton() {
	return (
		<div className="flex flex-col gap-y-6">
			<div className="h-8 w-32 animate-pulse bg-secondary" />
			<hr className="border-border" />
			<div className="h-12 w-full animate-pulse rounded-3xl bg-secondary" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="shell flex min-h-svh flex-col gap-y-6 py-8 sm:gap-y-12">
			<div className="h-6 w-64 animate-pulse bg-secondary" />
			<div className="flex flex-col gap-y-6 large:flex-row large:items-start large:gap-x-16 wide:gap-x-[7.5rem]">
				<div className="w-full">
					<GallerySkeleton />
				</div>
				<div className="flex w-full flex-col gap-y-6 py-8 large:max-w-[27.5rem] large:py-0">
					<div className="h-10 w-3/4 animate-pulse bg-secondary" />
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
						"h-4 w-4",
						i < rounded ? "fill-foreground text-foreground" : "fill-pressed text-pressed",
					)}
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
		{ href: "/", label: "Home Page" },
		...(product.category
			? [{ href: `/category/${product.category.slug}`, label: product.category.name }]
			: []),
		{ label: product.name },
	];

	const tabs: ProductTab[] = [
		...(product.summary || product.content
			? [
					{
						label: "Description",
						content: (
							<div className="flex flex-col gap-3">
								{product.summary && <p className="whitespace-pre-line">{product.summary}</p>}
								{product.content && (
									<div className="prose prose-sm max-w-none text-muted-foreground">
										<TiptapRenderer content={product.content} />
									</div>
								)}
							</div>
						),
					},
				]
			: []),
		...(product.variants.some((variant) => variant.sku)
			? [
					{
						label: "Details",
						content: (
							<p>
								SKU:{" "}
								{product.variants
									.map((variant) => variant.sku)
									.filter(Boolean)
									.join(", ")}
							</p>
						),
					},
				]
			: []),
		{
			label: "Shipping & Returns",
			content: (
				<p>
					Shipping options and costs are shown at checkout before you pay. Return terms are set out in the
					store&apos;s return policy; see our{" "}
					<Link href="/faq" className="text-foreground underline underline-offset-4">
						FAQ
					</Link>{" "}
					for details.
				</p>
			),
		},
	];

	return (
		<>
			<div className="shell relative flex min-h-svh flex-col gap-y-6 py-8 sm:gap-y-12">
				<JsonLdScript data={productJsonLd} />
				<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
				{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}
				<Crumbs items={crumbs} />
				<div className="relative flex flex-col gap-y-6 large:flex-row large:items-start large:gap-x-16 wide:gap-x-[7.5rem]">
					<div className="relative block w-full">
						<Suspense fallback={<GallerySkeleton />}>
							<MediaGallery images={allImages} productName={product.name} variants={product.variants} />
						</Suspense>
					</div>
					<div className="flex w-full flex-col gap-y-6 py-8 large:sticky large:top-24 large:max-w-[27.5rem] large:py-0">
						<div className="flex flex-col gap-y-1">
							{product.category && (
								<Link
									href={`/category/${product.category.slug}`}
									className="w-max text-copy text-muted-foreground hover:text-foreground"
								>
									{product.category.name}
								</Link>
							)}
							<h1 className="text-heading-sm sm:text-heading-md">{product.name}</h1>
							{reviewSummary && reviewSummary.reviewCount > 0 && (
								<a
									href="#reviews"
									className="mt-2 inline-flex items-center gap-2 text-copy transition-opacity hover:opacity-80"
								>
									<StarRow rating={reviewSummary.averageRating} />
									<span>{reviewSummary.averageRating.toFixed(1)}</span>
									<span className="text-muted-foreground">
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

						<ProductTabs tabs={tabs} />
					</div>
				</div>

				{reviews && <ProductReviews reviews={reviews} slug={slug} />}
			</div>

			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</>
	);
};
