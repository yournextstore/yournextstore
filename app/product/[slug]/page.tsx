import { Star } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCartButton } from "@/app/product/[slug]/add-to-cart-button";
import { BundleBuilder } from "@/app/product/[slug]/bundle-builder";
import { MediaGallery } from "@/app/product/[slug]/media-gallery";
import { ProductFeatures } from "@/app/product/[slug]/product-features";
import { ProductReviews } from "@/app/product/[slug]/product-reviews";
import { RelatedProducts } from "@/app/product/[slug]/related-products";
import { sortVariantsByOptions } from "@/app/product/[slug]/variant-order";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { blurPreview } from "@/lib/blur-placeholder";
import { getAllProducts, slugParams } from "@/lib/catalog-paths";
import { commerce, meGetCached, productGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	"use cache";
	cacheLife("minutes");
	const { slug } = await params;
	const product = await productGetCached(slug);

	if (!product) {
		return { title: "Product Not Found — Your Next Store" };
	}

	return {
		title: `${product.name} — Your Next Store`,
		description: product.summary ?? undefined,
		openGraph: {
			title: product.name,
			description: product.summary ?? undefined,
			images: product.images[0] ? [product.images[0]] : undefined,
		},
	};
}

// Every known address prerenders in full; one added later renders on its first visit (lib/catalog-paths.ts).
export const generateStaticParams = () => slugParams(getAllProducts(), (product) => product.slug);

const getProductPageData = async (slug: string) => {
	"use cache";
	cacheLife("minutes");

	const me = await meGetCached().catch(() => null);
	const reviewsEnabled = me?.store.settings?.enabledTools?.reviews ?? false;
	const restockNotificationsEnabled = me?.store.settings?.enabledTools?.restockNotifications ?? false;
	const [product, reviews] = await Promise.all([
		productGetCached(slug),
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

// An address added after the build renders in full on its first request before anything is sent, so a missing one
// answers 404 with the not-found page inside the layout, not a 200 behind an already-sent shell (AGENTS.md).
export const ensureStatic = "navigation";

// Listed addresses prerender in full: the boundary resolves at build time, so no fallback ever shows.
export default function ProductPage(props: Parameters<typeof ProductPageContent>[0]) {
	return (
		<Suspense fallback={null}>
			<ProductPageContent {...props} />
		</Suspense>
	);
}

async function ProductPageContent({ params }: { params: Promise<{ slug: string }> }) {
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

	const stockBadge =
		variants.length === 1 && variants[0]
			? Number(variants[0].stock ?? 0) > 0
				? "In stock"
				: "Sold out"
			: null;

	const [productJsonLd, preview] = await Promise.all([
		buildProductJsonLd(product, reviews, brand?.name ?? null),
		blurPreview(allImages[0]),
	]);

	return (
		<main>
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{variants[0] && <TrackProductView variant={variants[0]} name={product.name} />}

			{/* Breadcrumb / share strip */}
			<div className="bg-[var(--color-tertiary)] text-[var(--color-on-tertiary)] border-b border-foreground">
				<div className="max-w-[1280px] mx-auto px-5 md:px-20 py-3 flex items-center justify-between gap-4">
					<nav aria-label="Breadcrumb" className="label-caps flex items-center gap-2 truncate">
						<Link href="/" className="hover:underline">
							Home
						</Link>
						<span aria-hidden>/</span>
						<Link href="/products" className="hover:underline">
							Products
						</Link>
						<span aria-hidden>/</span>
						{product.category && (
							<>
								<Link href={`/category/${product.category.slug}`} className="hover:underline">
									{product.category.name}
								</Link>
								<span aria-hidden>/</span>
							</>
						)}
						<span className="truncate max-w-[40ch] opacity-80">{product.name}</span>
					</nav>
					{stockBadge && (
						<span className="label-caps neo-border bg-[var(--color-surface-container-lowest)] text-foreground px-2 py-1">
							{stockBadge}
						</span>
					)}
				</div>
			</div>

			{/* Hero / details */}
			<section className="border-b border-foreground bg-background">
				<div className="max-w-[1280px] mx-auto px-5 md:px-20 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
					<MediaGallery images={allImages} productName={product.name} variants={variants} preview={preview} />

					<div className="flex flex-col gap-8 lg:pt-4">
						<div>
							{brand ? (
								<Link
									href={`/products?brand=${encodeURIComponent(brand.slug)}`}
									className="label-caps inline-flex min-h-6 items-center text-[var(--color-on-surface-variant)] transition-colors hover:text-foreground"
								>
									{brand.name}
								</Link>
							) : (
								product.category && (
									<span className="label-caps text-[var(--color-on-surface-variant)]">
										{product.category.name}
									</span>
								)
							)}
							<h1 className="font-serif text-4xl md:text-5xl lg:text-[56px] leading-[1.05] mt-3 text-foreground text-balance">
								{product.name}
							</h1>
							{reviewSummary && reviewSummary.reviewCount > 0 && (
								<a
									href="#reviews"
									className="mt-4 inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
								>
									<StarRow rating={reviewSummary.averageRating} />
									<span className="font-semibold">{reviewSummary.averageRating.toFixed(1)}</span>
									<span className="text-[var(--color-on-surface-variant)] underline-offset-4 hover:underline">
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
						)}

						{product.content && (
							<div className="neo-border bg-[var(--color-surface-container-lowest)] p-6">
								<h2 className="label-caps mb-4">Details</h2>
								<div className="prose prose-sm max-w-none text-[var(--color-on-surface-variant)] tiptap-content">
									<TiptapRenderer content={product.content} />
								</div>
							</div>
						)}
					</div>
				</div>
			</section>

			<ProductFeatures />
			{reviews && <ProductReviews reviews={reviews} productId={product.id} />}
			<RelatedProducts productId={product.id} />
		</main>
	);
}
