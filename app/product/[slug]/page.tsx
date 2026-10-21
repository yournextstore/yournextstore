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
import { FEATURES } from "@/components/sections/home/why-choose";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { getStoreInfo } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return (
		<div className="flex flex-col gap-4">
			<Skeleton className="aspect-square rounded-lg" />
		</div>
	);
}

function PurchasePanelSkeleton() {
	return (
		<div className="space-y-6">
			<Skeleton className="h-20 w-full" />
			<Skeleton className="h-9 w-32" />
			<Skeleton className="h-12 w-full rounded-md" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="mx-auto min-h-svh max-w-[66rem] px-4 py-10 sm:px-6">
			<div className="grid gap-10 lg:grid-cols-[25rem_minmax(0,1fr)] lg:gap-12">
				<GallerySkeleton />
				<div className="space-y-6">
					<Skeleton className="h-10 w-3/4" />
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
	const [{ product, reviews, restockNotificationsEnabled, brand }, { freeShipping }] = await Promise.all([
		getProductPageData(slug),
		getStoreInfo(),
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

	return (
		<div className="min-h-svh">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{variants[0] && <TrackProductView variant={variants[0]} name={product.name} />}
			<div className="mx-auto max-w-[66rem] px-4 py-10 sm:px-6">
				<div className="grid gap-10 lg:grid-cols-[25rem_minmax(0,1fr)] lg:gap-12">
					<Suspense fallback={<GallerySkeleton />}>
						<MediaGallery images={allImages} productName={product.name} variants={variants} />
					</Suspense>

					<div className="min-w-0 space-y-6">
						<div className="space-y-2">
							{brand && (
								<Link
									href={`/products?brand=${encodeURIComponent(brand.slug)}`}
									className="inline-flex min-h-6 items-center text-xs font-medium tracking-[0.2em] text-steel uppercase transition-colors hover:text-main"
								>
									{brand.name}
								</Link>
							)}
							{reviewSummary && reviewSummary.reviewCount > 0 && (
								<a href="#reviews" className="inline-flex items-center gap-2 text-sm hover:opacity-80">
									<StarRow rating={reviewSummary.averageRating} />
									<span className="text-steel">
										({reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"})
									</span>
								</a>
							)}
							<h1 className="text-[2rem] leading-tight text-ink sm:text-4xl">{product.name}</h1>
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
									summary={product.summary}
									volumePricingTiers={product.volumePricingTiers}
									restockNotificationsEnabled={restockNotificationsEnabled}
									subscriptionMode={product.subscriptionMode}
									plans={plans}
									freeShipping={freeShipping}
								/>
							</Suspense>
						)}
					</div>
				</div>
			</div>

			{/* Product name over the three icon badges, as in the original. */}
			<section aria-labelledby="product-highlights" className="mx-auto max-w-5xl px-4 pt-10 sm:px-6">
				<h2
					id="product-highlights"
					className="text-center font-montserrat text-[1.75rem] font-bold tracking-tight text-ink sm:text-4xl"
				>
					{product.name}
				</h2>
				<ul className="mt-10 grid grid-cols-1 gap-8 xs:grid-cols-3">
					{FEATURES.map((feature) => (
						<li key={feature.title} className="flex flex-col items-center gap-3 text-center">
							<span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink text-ink">
								<feature.icon className="h-8 w-8" strokeWidth={1.4} aria-hidden="true" />
							</span>
							<span className="font-montserrat text-sm font-bold text-ink uppercase">{feature.title}</span>
						</li>
					))}
				</ul>
			</section>

			{/* Long description: the original's photo + "USAGE TIPS" block, from the product's own content. */}
			{product.content && (
				<section className="mx-auto mt-16 grid max-w-[66rem] items-center gap-10 px-4 sm:px-6 md:grid-cols-2">
					<div className="relative aspect-[16/9] overflow-hidden rounded-sm bg-tile">
						{(allImages[1] ?? allImages[0]) && (
							<YNSMedia
								src={allImages[1] ?? allImages[0] ?? ""}
								alt=""
								fill
								sizes="(max-width: 768px) 100vw, 520px"
								className="object-cover"
							/>
						)}
					</div>
					<div>
						<h2 className="mb-5 text-xl text-ink uppercase">{product.name}: Details</h2>
						<div className="prose prose-sm max-w-none tiptap-content">
							<TiptapRenderer content={product.content} />
						</div>
					</div>
				</section>
			)}

			{/* Reviews Section */}
			{reviews && (
				<div className="mx-auto max-w-[66rem] px-4 sm:px-6">
					<ProductReviews reviews={reviews} slug={slug} />
				</div>
			)}

			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</div>
	);
};
