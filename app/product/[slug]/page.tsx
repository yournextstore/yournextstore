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
import { PageHeading } from "@/components/page-heading";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { getStoreInfo } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return (
		<div className="p-5">
			<Skeleton className="aspect-square rounded-[4px] sm:aspect-[4/3]" />
		</div>
	);
}

function PurchasePanelSkeleton() {
	return (
		<div className="space-y-5">
			<Skeleton className="h-[150px] w-full rounded-[4px]" />
			<Skeleton className="h-[110px] w-full rounded-[4px]" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="min-h-svh">
			<div className="px-[15px] pt-5 pb-5 text-center sm:pt-10 lg:pb-[30px]">
				<Skeleton className="mx-auto h-5 w-64 max-w-full" />
				<Skeleton className="mx-auto mt-[10px] h-12 w-96 max-w-full" />
			</div>
			<div className="uk-container">
				<div className="uk-card grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
					<GallerySkeleton />
					<div className="border-t border-border p-5 lg:border-t-0 lg:border-l">
						<PurchasePanelSkeleton />
					</div>
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

	const crumbs = [
		{ href: "/", label: "Home" },
		{ href: "/products", label: "Catalog" },
		...(product.category
			? [{ href: `/category/${product.category.slug}`, label: product.category.name }]
			: []),
		{ label: product.name },
	];

	return (
		<div className="min-h-svh pb-10 lg:pb-[70px]">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{variants[0] && <TrackProductView variant={variants[0]} name={product.name} />}
			<PageHeading crumbs={crumbs} title={product.name} />

			<div className="uk-container">
				<div className="uk-card">
					<div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
						<Suspense fallback={<GallerySkeleton />}>
							<MediaGallery images={allImages} productName={product.name} variants={variants} />
						</Suspense>

						<div className="space-y-5 border-t border-border p-5 lg:border-t-0 lg:border-l">
							{brand && (
								<Link
									href={`/products?brand=${encodeURIComponent(brand.slug)}`}
									className="inline-flex min-h-6 items-center text-uk-xs uppercase text-muted-foreground hover:text-foreground"
								>
									{brand.name}
								</Link>
							)}
							{reviewSummary && reviewSummary.reviewCount > 0 && (
								<a
									href="#reviews"
									className="inline-flex items-center gap-[5px] text-uk-sm text-muted-foreground hover:text-foreground"
								>
									<StarRow rating={reviewSummary.averageRating} />
									<span>({reviewSummary.reviewCount})</span>
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
										summary={product.content ? product.summary : null}
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

					{/* Tabs row (UIkit subnav pill) over the long description. */}
					<div className="border-t border-border p-5 lg:px-10 lg:py-[30px]">
						<ul className="mb-5 flex flex-wrap gap-[5px]">
							<li>
								<span className="inline-block rounded-[4px] bg-primary px-[10px] py-[5px] text-uk-xs uppercase text-primary-foreground">
									Overview
								</span>
							</li>
						</ul>
						<h2 className="sr-only">Overview</h2>
						<div className="prose prose-sm max-w-[640px] text-muted-foreground tiptap-content">
							{product.content ? (
								<TiptapRenderer content={product.content} />
							) : (
								<p>{product.summary ?? product.name}</p>
							)}
						</div>
					</div>
				</div>

				{reviews && <ProductReviews reviews={reviews} slug={slug} />}

				<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
			</div>
		</div>
	);
};
