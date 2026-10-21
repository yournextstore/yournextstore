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
import { Crumbs } from "@/components/halfstep/crumbs";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { getShippingLabel } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return (
		<div className="hs-card flex flex-col gap-4 p-2.5 lg:sticky lg:top-24 lg:self-start">
			<Skeleton className="aspect-square rounded-[10px]" />
		</div>
	);
}

function PurchasePanelSkeleton() {
	return (
		<div className="space-y-6">
			<Skeleton className="h-16 w-full" />
			<Skeleton className="h-20 w-full" />
			<Skeleton className="h-16 w-32" />
			<Skeleton className="h-[52px] w-full rounded-[11px]" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="hs-wrap min-h-svh pb-20 pt-8 sm:pt-12">
			<Skeleton className="h-4 w-64" />
			<div className="mt-6 grid items-start gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
				<GallerySkeleton />
				<div className="hs-panel space-y-5 p-5 sm:p-7">
					<Skeleton className="h-4 w-32" />
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
					className={cn("h-4 w-4", i < rounded ? "fill-lime text-foreground" : "fill-muted text-muted")}
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
	const [{ product, reviews, restockNotificationsEnabled, brand }, shipping] = await Promise.all([
		getProductPageData(slug),
		getShippingLabel(),
	]);

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

	const first = product.variants[0];
	const specs = [
		{
			label: "Availability",
			value: product.variants.some((v) => v.stock !== 0) ? "In stock" : "Out of stock",
		},
		{
			label: "Options",
			value: product.variants.length > 1 ? `${product.variants.length} variants` : "One finish",
		},
		...(first?.sku && product.variants.length === 1 ? [{ label: "SKU", value: first.sku }] : []),
		...(product.category ? [{ label: "Category", value: product.category.name }] : []),
		...(shipping ? [{ label: "Shipping", value: shipping }] : []),
	];

	return (
		<div className="hs-wrap min-h-svh pb-20 pt-8 sm:pt-12">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{variants[0] && <TrackProductView variant={variants[0]} name={product.name} />}
			<Crumbs
				items={[
					{ href: "/", label: "Home" },
					{ href: "/products", label: "Catalogue" },
					...(product.category
						? [{ href: `/category/${product.category.slug}`, label: product.category.name }]
						: []),
					{ label: product.name },
				]}
			/>
			<div className="mt-6 grid items-start gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
				<Suspense fallback={<GallerySkeleton />}>
					<MediaGallery images={allImages} productName={product.name} variants={variants} />
				</Suspense>

				<div className="hs-panel min-w-0 p-5 sm:p-7 lg:sticky lg:top-24">
					<p className="hs-kicker mb-3">[ {product.category?.name ?? "Catalogue"} ]</p>
					{brand && (
						<Link
							href={`/products?brand=${encodeURIComponent(brand.slug)}`}
							className="hs-label mb-2 inline-flex min-h-6 items-center transition-colors hover:text-signal"
						>
							{brand.name}
						</Link>
					)}
					<h1 className="hs-display mb-5 text-[clamp(2rem,4.4vw,3.1rem)] text-balance wrap-break-word">
						{product.name}
					</h1>
					{reviewSummary && reviewSummary.reviewCount > 0 && (
						<a
							href="#reviews"
							className="mb-5 inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
						>
							<StarRow rating={reviewSummary.averageRating} />
							<span className="font-bold">{reviewSummary.averageRating.toFixed(1)}</span>
							<span className="text-muted-foreground underline-offset-4 hover:underline">
								({reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"})
							</span>
						</a>
					)}

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

			{/* The original's part list: specs printed plainly, then the long description. */}
			<section
				aria-labelledby="specs-title"
				className="mt-16 grid gap-8 border-t border-line pt-10 sm:mt-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12"
			>
				<div>
					<p className="hs-kicker mb-3">[ Spec sheet ]</p>
					<h2 id="specs-title" className="hs-display hs-h3">
						Stated plainly.
					</h2>
				</div>
				<div>
					<dl className="border-t border-line">
						{specs.map((spec) => (
							<div
								key={spec.label}
								className="flex items-baseline justify-between gap-4 border-b border-line py-3"
							>
								<dt className="hs-label">{spec.label}</dt>
								<dd className="text-right text-[0.95rem] font-bold">{spec.value}</dd>
							</div>
						))}
					</dl>
					{product.content && (
						<div className="prose prose-sm mt-8 max-w-none dark:prose-invert tiptap-content">
							<TiptapRenderer content={product.content} />
						</div>
					)}
				</div>
			</section>

			{/* Reviews Section */}
			{reviews && <ProductReviews reviews={reviews} slug={slug} />}

			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</div>
	);
};
