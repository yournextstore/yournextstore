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
import { Crumbs } from "@/components/catalogue";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return <div className="aspect-[4/5] animate-pulse bg-surface" />;
}

function PurchasePanelSkeleton() {
	return (
		<div className="mt-5 space-y-8">
			<div className="h-7 w-24 bg-surface" />
			<div className="h-20 w-full max-w-md bg-surface" />
			<div className="h-48 w-full border-y border-border" />
			<div className="h-12 w-full bg-surface" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="shell min-h-svh">
			<div className="py-6">
				<div className="h-3 w-48 bg-surface" />
			</div>
			<div className="grid items-start gap-x-12 gap-y-10 border-t border-border pt-8 lg:grid-cols-12">
				<div className="lg:col-span-7">
					<GallerySkeleton />
				</div>
				<div className="lg:col-span-5">
					<div className="h-3 w-24 bg-surface" />
					<div className="mt-5 h-14 w-3/4 bg-surface" />
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
						"h-3.5 w-3.5",
						i < rounded ? "fill-walnut text-walnut" : "fill-surface-strong text-surface-strong",
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

	const label = product.category?.name ?? "The catalogue";

	return (
		<div className="shell min-h-svh">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{variants[0] && <TrackProductView variant={variants[0]} name={product.name} />}
			<div className="py-6">
				<Crumbs
					items={[
						{ href: "/products", label: "Catalogue" },
						...(product.category
							? [{ href: `/category/${product.category.slug}`, label: product.category.name }]
							: []),
						{ label: product.name },
					]}
				/>
			</div>

			<div className="grid items-start gap-x-12 gap-y-10 border-t border-border pt-8 lg:grid-cols-12">
				<div className="min-w-0 lg:col-span-7">
					<Suspense fallback={<GallerySkeleton />}>
						<MediaGallery images={allImages} productName={product.name} variants={variants} />
					</Suspense>
				</div>

				<div className="min-w-0 lg:sticky lg:top-28 lg:col-span-5">
					<div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
						<p className="label">{label}</p>
						{brand && (
							<Link
								href={`/products?brand=${encodeURIComponent(brand.slug)}`}
								className="link link-mono inline-flex min-h-6 items-center text-muted-foreground"
							>
								{brand.name}
							</Link>
						)}
					</div>
					<h1 className="type-h2 mt-5">{product.name}</h1>
					{reviewSummary && reviewSummary.reviewCount > 0 && (
						<a
							href="#reviews"
							className="mono mt-4 inline-flex items-center gap-2 text-[0.75rem] transition-colors hover:text-walnut"
						>
							<StarRow rating={reviewSummary.averageRating} />
							<span>{reviewSummary.averageRating.toFixed(1)}</span>
							<span className="text-muted-foreground">
								({reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"})
							</span>
						</a>
					)}

					{/* Configurable bundle → group builder; otherwise the standard variant add-to-cart. */}
					{product.type === "bundle" && product.bundle?.groups?.length ? (
						<div className="mt-8">
							{product.summary && <p className="type-body mb-8 max-w-[46ch]">{product.summary}</p>}
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
						</div>
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
								specs={product.category ? [["Category", product.category.name]] : []}
							/>
						</Suspense>
					)}
				</div>
			</div>

			{product.content && (
				<section className="mt-24 grid gap-8 border-t border-border pt-8 md:mt-32 md:grid-cols-12">
					<h2 className="type-h3 md:col-span-5">About the piece</h2>
					<div className="prose prose-sm max-w-none text-muted-foreground tiptap-content md:col-span-7">
						<TiptapRenderer content={product.content} />
					</div>
				</section>
			)}

			{reviews && <ProductReviews reviews={reviews} slug={slug} />}

			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</div>
	);
};
