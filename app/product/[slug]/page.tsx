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
import { ShareButton } from "@/app/product/[slug]/share-button";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return <Skeleton className="aspect-square rounded-lg bg-card" />;
}

function PurchasePanelSkeleton() {
	return (
		<div className="mt-4 space-y-8">
			<Skeleton className="h-8 w-28" />
			<Skeleton className="h-12 w-72" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="shell min-h-svh">
			<Skeleton className="h-4 w-28" />
			<div className="mt-6 grid gap-10 md:grid-cols-2 md:gap-16">
				<GallerySkeleton />
				<div className="space-y-4">
					<Skeleton className="h-4 w-24" />
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

	const soldOut = product.variants.length > 0 && product.variants.every((v) => v.stock === 0);

	return (
		<div className="shell">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}
			<Link
				href="/products"
				className="text-xs uppercase tracking-widest text-faint transition-colors hover:text-foreground"
			>
				&larr; Back to shop
			</Link>

			<div className="mt-6 grid gap-10 md:grid-cols-2 md:gap-16">
				<Suspense fallback={<GallerySkeleton />}>
					<MediaGallery
						images={allImages}
						productName={product.name}
						variants={product.variants}
						soldOut={soldOut}
					/>
				</Suspense>

				<div className="reveal flex min-w-0 flex-col" style={{ animationDelay: "90ms" }}>
					{product.category && (
						<div className="mb-4 text-xs uppercase tracking-widest text-faint">
							<Link
								href={`/category/${product.category.slug}`}
								className="transition-colors hover:text-foreground"
							>
								{product.category.name}
							</Link>
						</div>
					)}

					<h1 className="font-serif text-4xl tracking-tight text-balance text-foreground">{product.name}</h1>
					{reviewSummary && reviewSummary.reviewCount > 0 && (
						<a
							href="#reviews"
							className="mt-3 inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
						>
							<StarRow rating={reviewSummary.averageRating} />
							<span className="font-medium">{reviewSummary.averageRating.toFixed(1)}</span>
							<span className="text-muted-foreground underline-offset-4 hover:underline">
								({reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"})
							</span>
						</a>
					)}

					{/* Configurable bundle → group builder; otherwise the standard variant add-to-cart.
					    Renders only for bundle products, so it stays dormant for regular stores. */}
					{product.type === "bundle" && product.bundle?.groups?.length ? (
						<div className="mt-8">
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
								variants={product.variants}
								product={{
									id: product.id,
									name: product.name,
									slug: product.slug,
									images: product.images,
								}}
								summary={product.summary}
								description={
									product.content ? (
										<div className="markdown-content max-w-prose text-muted-foreground">
											<TiptapRenderer content={product.content} />
										</div>
									) : null
								}
								volumePricingTiers={product.volumePricingTiers}
								restockNotificationsEnabled={restockNotificationsEnabled}
							/>
						</Suspense>
					)}

					<ShareButton title={product.name} />
				</div>
			</div>

			{/* Reviews Section */}
			{reviews && <ProductReviews reviews={reviews} slug={slug} />}

			{/* Rendered inside this page's boundary (no nested Suspense): streaming it in after the
			    footer painted would push the footer down. */}
			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</div>
	);
};
