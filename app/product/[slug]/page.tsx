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
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return <Skeleton className="aspect-[590/460] rounded-card border border-border bg-secondary" />;
}

function PurchasePanelSkeleton() {
	return (
		<div className="space-y-5">
			<Skeleton className="h-6 w-24 bg-secondary" />
			<Skeleton className="h-11 w-full bg-secondary" />
			<Skeleton className="h-13 w-full rounded-full bg-secondary" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="shell min-h-svh py-6 lg:py-16">
			<div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
				<GallerySkeleton />
				<div className="mt-6 space-y-5 lg:mt-0">
					<Skeleton className="h-4 w-32 bg-secondary" />
					<Skeleton className="h-10 w-3/4 bg-secondary" />
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
					className={cn("h-4 w-4", i < rounded ? "fill-primary text-primary" : "fill-accent text-accent")}
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

	return (
		<div className="shell py-6 lg:py-16">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}
			<div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start lg:gap-12">
				<Suspense fallback={<GallerySkeleton />}>
					<MediaGallery images={allImages} productName={product.name} variants={product.variants} />
				</Suspense>

				<div className="mt-6 flex min-w-0 flex-col gap-4 lg:mt-0">
					<nav
						aria-label="Breadcrumb"
						className="text-label-sm uppercase tracking-[0.12em] text-muted-foreground"
					>
						<Link href="/products" className="hover:text-foreground">
							Shop
						</Link>
						{product.category && (
							<>
								{" · "}
								<Link href={`/category/${product.category.slug}`} className="hover:text-foreground">
									{product.category.name}
								</Link>
							</>
						)}
					</nav>
					<h1 className="text-balance font-display text-heading-lg font-semibold leading-[1.15] lg:text-display-md">
						{product.name}
					</h1>
					{reviewSummary && reviewSummary.reviewCount > 0 && (
						<a
							href="#reviews"
							className="inline-flex items-center gap-2 text-body-sm transition-opacity hover:opacity-80"
						>
							<StarRow rating={reviewSummary.averageRating} />
							<span className="font-semibold">{reviewSummary.averageRating.toFixed(1)}</span>
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
								variants={product.variants}
								product={{
									id: product.id,
									name: product.name,
									slug: product.slug,
									images: product.images,
								}}
								summary={product.summary}
								volumePricingTiers={product.volumePricingTiers}
								restockNotificationsEnabled={restockNotificationsEnabled}
							/>
						</Suspense>
					)}

					{product.content && (
						<section aria-labelledby="details-title" className="mt-4 border-t border-border pt-6">
							<h2 id="details-title" className="mb-3 font-semibold">
								Details
							</h2>
							<div className="prose prose-sm max-w-none text-muted-foreground">
								<TiptapRenderer content={product.content} />
							</div>
						</section>
					)}
				</div>
			</div>

			{reviews && <ProductReviews reviews={reviews} slug={slug} />}

			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</div>
	);
};
