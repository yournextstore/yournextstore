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
import { Crumbs } from "@/components/crumbs";
import { Divider } from "@/components/sections/home";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return (
		<div className="lg:sticky lg:top-[calc(var(--header-h)+16px)] lg:self-start">
			<Skeleton className="aspect-square w-full rounded-[4px] bg-panel" />
		</div>
	);
}

function PurchasePanelSkeleton() {
	return (
		<div className="space-y-4">
			<Skeleton className="h-11 w-40 bg-panel" />
			<Skeleton className="h-[34px] w-48 bg-panel" />
			<Skeleton className="h-[52px] w-full rounded-[4px] bg-panel" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="container-x min-h-svh pb-16 pt-8 sm:pt-12">
			<div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
				<GallerySkeleton />
				<div className="space-y-6">
					<Skeleton className="h-3 w-32 bg-panel" />
					<Skeleton className="h-24 w-3/4 bg-panel" />
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
					className={cn("h-4 w-4", i < rounded ? "fill-gold text-gold" : "fill-transparent text-gold")}
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
	const firstVariant = variants[0];
	const spec = [
		...(product.category ? [{ term: "Shelf", detail: product.category.name }] : []),
		{ term: "Options", detail: variants.length === 1 ? "One" : String(variants.length) },
		...(variants.length === 1 && firstVariant?.sku ? [{ term: "SKU", detail: firstVariant.sku }] : []),
	];

	return (
		<div className="min-h-svh">
			<div className="container-x pb-16 pt-8 sm:pt-12">
				<JsonLdScript data={productJsonLd} />
				<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
				{firstVariant && <TrackProductView variant={firstVariant} name={product.name} />}
				<div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
					<Suspense fallback={<GallerySkeleton />}>
						<MediaGallery images={allImages} productName={product.name} variants={variants} />
					</Suspense>

					<div className="min-w-0 space-y-7 lg:pt-2">
						<div>
							<Crumbs
								className="caps mb-6 text-[0.75rem] tracking-[0.15em] text-dim"
								items={[
									{ label: "The shelf", href: "/products" },
									...(product.category
										? [{ label: product.category.name, href: `/category/${product.category.slug}` }]
										: []),
								]}
							/>
							{brand && (
								<Link
									href={`/products?brand=${encodeURIComponent(brand.slug)}`}
									className="caps mb-2 inline-flex min-h-6 items-center text-[0.75rem] tracking-[0.2em] text-gold transition-colors hover:text-cream"
								>
									{brand.name}
								</Link>
							)}
							<h1 className="serif wrap-break-word text-[2rem] font-bold leading-[1.2] text-cream sm:text-[2.5rem]">
								{product.name}
							</h1>
							{product.category && (
								<p className="serif mt-2 text-[1.125rem] tracking-[0.05em] text-gold italic">
									{product.category.name}
								</p>
							)}
							<Divider glyph="◆" width="w-10" className="mt-5 justify-start" />
							{product.summary && (
								<p className="mt-5 max-w-[48ch] whitespace-pre-line text-[1.0625rem] leading-[1.75] text-ink">
									{product.summary}
								</p>
							)}
							{reviewSummary && reviewSummary.reviewCount > 0 && (
								<a
									href="#reviews"
									className="mt-4 inline-flex items-center gap-2 text-xs text-dim transition-opacity hover:opacity-80"
								>
									<StarRow rating={reviewSummary.averageRating} />
									<span>
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
									variants={variants}
									product={{
										id: product.id,
										name: product.name,
										slug: product.slug,
										images: product.images,
									}}
									volumePricingTiers={product.volumePricingTiers}
									restockNotificationsEnabled={restockNotificationsEnabled}
									subscriptionMode={product.subscriptionMode}
									plans={plans}
								/>
							</Suspense>
						)}

						<dl className="panel px-5 py-2">
							{spec.map((row) => (
								<div
									key={row.term}
									className="grid grid-cols-[110px_1fr] items-baseline gap-4 border-b border-line-2 py-3 last:border-b-0"
								>
									<dt className="caps text-[0.75rem] tracking-[0.15em] text-dim">{row.term}</dt>
									<dd className="font-semibold text-cream">{row.detail}</dd>
								</div>
							))}
						</dl>
					</div>
				</div>

				{product.content && (
					<section aria-labelledby="closer-title" className="rule-top mt-16 pt-16">
						<h2 id="closer-title" className="section-title">
							A Closer Look
						</h2>
						<div className="prose tiptap-content mx-auto max-w-[800px] text-[1.0625rem] leading-[1.75]">
							<TiptapRenderer content={product.content} />
						</div>
					</section>
				)}

				{reviews && <ProductReviews reviews={reviews} slug={slug} />}

				<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
			</div>
		</div>
	);
};
