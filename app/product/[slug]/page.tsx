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
import { sortVariantsByOptions } from "@/app/product/[slug]/variant-order";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { splitTitle } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return <div className="aspect-square" />;
}

function PurchasePanelSkeleton() {
	return (
		<div className="space-y-8">
			<Skeleton className="h-12 w-40 rounded-sm" />
			<Skeleton className="h-[4.5rem] w-36 rounded-sm" />
			<Skeleton className="h-[3.25rem] w-full rounded-sm" />
		</div>
	);
}

const STAGE_GRID =
	"grid grid-cols-1 md:grid-cols-[minmax(0,40fr)_minmax(0,60fr)] md:grid-rows-[auto_1fr] md:gap-x-10 xl:gap-x-14";

function ProductPageSkeleton() {
	return (
		<div className="min-h-svh">
			<section data-hero className="relative isolate overflow-hidden">
				<div aria-hidden="true" className="stage-backdrop pointer-events-none absolute inset-0" />
				<div className={`container-stage relative pb-20 pt-28 md:pt-32 ${STAGE_GRID}`}>
					<div className="space-y-6 md:col-start-1 md:row-start-1">
						<Skeleton className="h-4 w-48 rounded-sm" />
						<Skeleton className="h-20 w-3/4 rounded-sm" />
					</div>
					<div className="mt-10 md:col-start-2 md:row-span-2 md:row-start-1 md:mt-0">
						<GallerySkeleton />
					</div>
					<div className="mt-10 md:col-start-1 md:row-start-2">
						<PurchasePanelSkeleton />
					</div>
				</div>
			</section>
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
					className={cn("h-4 w-4", i < rounded ? "fill-gold text-gold" : "fill-muted text-muted")}
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
	// The SDK gives the product a brand id only; an inactive brand isn't shown.
	const brand = product?.brandId
		? await commerce.brandGet({ idOrSlug: product.brandId }).catch(() => null)
		: null;

	return {
		product,
		reviews,
		restockNotificationsEnabled,
		brand: brand?.active ? { name: brand.name, slug: brand.slug } : null,
	};
};

const ProductDetails = async ({ params }: { params: Promise<{ slug: string }> }) => {
	const { slug } = await params;
	const { product, reviews, restockNotificationsEnabled, brand } = await getProductPageData(slug);

	if (!product) {
		notFound();
	}

	const reviewSummary = reviews?.summary ?? null;
	const variants = sortVariantsByOptions(product.variants);

	// The plans a shopper can pick, in the merchant's order. productGet lists inactive plans too, and
	// the cart refuses those.
	const plans = product.subscriptionPlanProducts
		.map(({ subscriptionPlan }) => subscriptionPlan)
		.filter((plan) => plan.active)
		.sort((a, b) => a.position - b.position)
		.map(({ id, name, discountPercent, benefits }) => ({ id, name, discountPercent, benefits }));

	const allImages = [
		...product.images,
		...variants.flatMap((v) => v.images).filter((img) => !product.images.includes(img)),
	];

	const productJsonLd = await buildProductJsonLd(product, reviews, brand?.name ?? null);

	const [lead, gilt] = splitTitle(product.name);
	const firstVariant = variants[0];
	const sheet = [
		...(brand ? [{ label: "Brand", value: brand.name }] : []),
		...(product.category ? [{ label: "Category", value: product.category.name }] : []),
		{
			label: "Finishes",
			value: variants.length > 1 ? `${variants.length} options` : "One finish",
		},
		...(firstVariant?.sku ? [{ label: "Reference", value: firstVariant.sku }] : []),
		{
			label: "Availability",
			value: variants.some((variant) => variant.stock !== 0) ? "Ready to ship" : "Sold out",
		},
	];

	return (
		<div className="min-h-svh">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{firstVariant && <TrackProductView variant={firstVariant} name={product.name} />}

			{/* The launch stage again: details at 40, the lit product at 60. */}
			<section data-hero className="relative isolate overflow-hidden">
				<div aria-hidden="true" className="stage-backdrop pointer-events-none absolute inset-0" />
				<div aria-hidden="true" className="noise pointer-events-none absolute inset-0" />
				<div className={`container-stage relative pb-20 pt-28 md:pb-28 md:pt-32 ${STAGE_GRID}`}>
					<div className="animate-rise md:col-start-1 md:row-start-1">
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbLink render={<Link href="/products" />}>Shop</BreadcrumbLink>
								</BreadcrumbItem>
								{product.category && (
									<>
										<BreadcrumbSeparator />
										<BreadcrumbItem>
											<BreadcrumbLink render={<Link href={`/category/${product.category.slug}`} />}>
												{product.category.name}
											</BreadcrumbLink>
										</BreadcrumbItem>
									</>
								)}
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbPage className="text-warm">{product.name}</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
						{brand && (
							<Link
								href={`/products?brand=${encodeURIComponent(brand.slug)}`}
								className="mt-6 inline-flex min-h-6 items-center text-kicker font-medium uppercase tracking-[0.42em] text-warm transition-colors hover:text-foreground"
							>
								{brand.name}
							</Link>
						)}
						<h1
							className={cn(
								"break-words font-display text-[clamp(2.6rem,9vw,4.75rem)] font-light leading-[0.95] tracking-[-0.03em] text-ink",
								brand ? "mt-3" : "mt-6",
							)}
						>
							{lead && <span>{lead} </span>}
							<span className="title-gilt">{gilt}</span>
						</h1>
						{reviewSummary && reviewSummary.reviewCount > 0 && (
							<a
								href="#reviews"
								className="mt-5 inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
							>
								<StarRow rating={reviewSummary.averageRating} />
								<span className="font-medium">{reviewSummary.averageRating.toFixed(1)}</span>
								<span className="text-muted-foreground underline-offset-4 hover:underline">
									({reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"})
								</span>
							</a>
						)}
					</div>

					<div className="relative mt-10 md:col-start-2 md:row-span-2 md:row-start-1 md:mt-0 md:self-center">
						<Suspense fallback={<GallerySkeleton />}>
							<MediaGallery images={allImages} productName={product.name} variants={variants} />
						</Suspense>
					</div>

					<div className="mt-10 md:col-start-1 md:row-start-2 md:mt-10">
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
									variants={variants}
									product={{
										id: product.id,
										name: product.name,
										slug: product.slug,
										images: product.images,
									}}
									summary={product.summary}
									volumePricingTiers={product.volumePricingTiers}
									restockNotificationsEnabled={restockNotificationsEnabled}
									subscriptionMode={product.subscriptionMode}
									plans={plans}
								/>
							</Suspense>
						)}
					</div>
				</div>
			</section>

			{/* The original's "Technical sheet, distilled", for one product. */}
			<section className="border-t border-hairline bg-band-deep py-24 md:py-32">
				<div className="container-wide grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
					<div className="lg:col-span-4">
						<p className="kicker">Details</p>
						<h2 className="mt-6 font-display text-4xl font-light tracking-[-0.02em] text-ink md:text-[2.75rem] md:leading-[1.1]">
							The pair, distilled.
						</h2>
					</div>
					<div className="lg:col-span-8">
						<dl className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-hairline-strong bg-hairline-strong sm:grid-cols-2">
							{sheet.map((cell) => (
								<div key={cell.label} className="flex flex-col justify-center bg-panel px-8 py-7 md:px-10">
									<dt className="text-micro font-medium uppercase tracking-[0.28em] text-muted-foreground">
										{cell.label}
									</dt>
									<dd className="mt-3 break-words font-display text-xl font-light text-ink md:text-2xl">
										{cell.value}
									</dd>
								</div>
							))}
						</dl>
						{product.content && (
							<div className="prose prose-sm mt-12 max-w-none text-muted-foreground dark:prose-invert tiptap-content">
								<TiptapRenderer content={product.content} />
							</div>
						)}
					</div>
				</div>
			</section>

			{reviews && (
				<div className="container-wide">
					<ProductReviews reviews={reviews} slug={slug} />
				</div>
			)}

			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</div>
	);
};
