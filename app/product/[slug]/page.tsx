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
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// The purchase panel reads useSearchParams (selected variant), so it streams behind its own
// boundary; its fallback holds the same rows so nothing below it moves.
function PurchasePanelSkeleton() {
	return (
		<div aria-hidden="true">
			<div className="h-[1.25em] w-28 bg-panel text-nav" />
			<div className="mt-6 h-8 w-40 bg-panel" />
			<div className="mt-6 h-[3.3rem] w-full border-b border-snow" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="min-h-svh lg:grid lg:grid-cols-2">
			<div className="aspect-[4/5] animate-pulse bg-panel lg:order-2 lg:aspect-auto lg:h-svh" />
			<div className="space-y-4 px-4 py-8 lg:px-[3.5vw] lg:py-[1.5vw]">
				<div className="h-[1.25em] w-2/3 animate-pulse bg-panel text-nav" />
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
					className={cn("h-4 w-4", i < rounded ? "fill-snow text-snow" : "text-muted-foreground")}
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

	return (
		<div className="min-h-svh">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{variants[0] && <TrackProductView variant={variants[0]} name={product.name} />}
			{/* The original's product page: words on the left half, the photograph filling the right. */}
			<div className="lg:grid lg:grid-cols-2">
				<div className="lg:order-2">
					<MediaGallery images={allImages} productName={product.name} />
				</div>

				<div className="px-4 pb-12 pt-6 lg:px-[3.5vw] lg:pb-[4vw] lg:pt-[1.5vw]">
					<nav aria-label="Breadcrumb" className="mb-4 text-foot text-muted-foreground">
						<Link href="/products" className="hover:text-snow">
							Shop
						</Link>
						{product.category && (
							<>
								{" / "}
								<Link href={`/category/${product.category.slug}`} className="hover:text-snow">
									{product.category.name}
								</Link>
							</>
						)}
					</nav>
					{brand && (
						<Link
							href={`/products?brand=${encodeURIComponent(brand.slug)}`}
							className="mb-1 inline-flex min-h-6 items-center text-foot text-muted-foreground underline-offset-[0.3em] hover:text-snow hover:underline"
						>
							{brand.name}
						</Link>
					)}
					<h1 className="text-nav">{product.name}</h1>
					{reviewSummary && reviewSummary.reviewCount > 0 && (
						<a href="#reviews" className="mt-2 inline-flex items-center gap-2 text-foot">
							<StarRow rating={reviewSummary.averageRating} />
							<span>{reviewSummary.averageRating.toFixed(1)}</span>
							<span className="text-muted-foreground underline underline-offset-[0.3em]">
								{reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"}
							</span>
						</a>
					)}

					<div className="mt-3">
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

					{product.content && (
						<section className="mt-10">
							<h2 className="sr-only">Product details</h2>
							<div className="prose prose-invert max-w-none text-copy prose-headings:font-normal prose-headings:text-copy prose-headings:text-snow prose-p:text-snow/90 prose-li:text-snow/90 tiptap-content">
								<TiptapRenderer content={product.content} />
							</div>
						</section>
					)}
				</div>
			</div>

			{reviews && (
				<div className="px-4 md:px-[2vw]">
					<ProductReviews reviews={reviews} slug={slug} />
				</div>
			)}

			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</div>
	);
};
