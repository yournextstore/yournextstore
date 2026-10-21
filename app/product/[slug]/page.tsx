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
import { PageBar, PageBarSkeleton } from "@/components/gf/page-bar";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { commerce, meGetCached } from "@/lib/commerce";
import { splitProductName } from "@/lib/display";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return <Skeleton className="aspect-square rounded-[20px] bg-flash-white sm:aspect-[4/3]" />;
}

function PurchasePanelSkeleton({ hasOptions = false }: { hasOptions?: boolean }) {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<Skeleton className="h-[53px] w-32 bg-flash-white" />
				<Skeleton className="h-11 w-32 rounded-full bg-flash-white" />
			</div>
			{hasOptions && <Skeleton className="h-[74px] w-2/3 bg-flash-white" />}
			<div className="flex gap-2.5">
				<Skeleton className="h-[50px] flex-1 rounded-full bg-flash-white" />
				<Skeleton className="h-[50px] flex-1 rounded-full bg-flash-white" />
			</div>
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="min-h-[calc(100svh+160px)]">
			<PageBarSkeleton />
			<div className="mt-[22px] rounded-[30px] bg-white p-2.5 gf-shadow">
				<GallerySkeleton />
			</div>
			<Skeleton className="mt-6 h-[33px] w-3/4 bg-flash-white" />
			<div className="mt-6">
				<PurchasePanelSkeleton />
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

	const [title, descriptor] = splitProductName(product.name);

	return (
		<div className="min-h-svh">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{variants[0] && <TrackProductView variant={variants[0]} name={product.name} />}
			<PageBar
				title={product.category?.name ?? "Details"}
				asHeading={false}
				fallbackHref={product.category ? `/category/${product.category.slug}` : "/products"}
			/>

			<div className="mt-[22px] rounded-[30px] bg-white p-2.5 gf-shadow">
				<Suspense fallback={<GallerySkeleton />}>
					<MediaGallery images={allImages} productName={product.name} variants={variants} />
				</Suspense>
			</div>

			<div className="mt-6 space-y-6">
				<div className="space-y-[5px]">
					{brand && (
						<Link
							href={`/products?brand=${encodeURIComponent(brand.slug)}`}
							className="inline-flex min-h-6 items-center text-gf-sm font-bold text-green-500 transition-colors hover:text-green-700"
						>
							{brand.name}
						</Link>
					)}
					<h1 className="text-gf-h2 font-bold text-balance break-words">
						{title}
						{descriptor && (
							<span className="mt-1.5 block text-gf-h5 font-normal text-muted-foreground">{descriptor}</span>
						)}
					</h1>
					{reviewSummary && reviewSummary.reviewCount > 0 && (
						<a
							href="#reviews"
							className="inline-flex items-center gap-2 text-gf-h6 transition-opacity hover:opacity-80"
						>
							<StarRow rating={reviewSummary.averageRating} />
							<span className="font-bold">{reviewSummary.averageRating.toFixed(1)}</span>
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
					<Suspense fallback={<PurchasePanelSkeleton hasOptions={variants.length > 1} />}>
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

			{product.content && (
				<section className="mt-6 rounded-[30px] bg-white p-5 gf-shadow">
					<h2 className="mb-3 text-gf-h5 font-bold">Product details</h2>
					<div className="prose prose-sm max-w-none text-muted-foreground tiptap-content">
						<TiptapRenderer content={product.content} />
					</div>
				</section>
			)}

			{/* Reviews Section */}
			{reviews && <ProductReviews reviews={reviews} slug={slug} />}

			{/* Related Products */}
			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</div>
	);
};
