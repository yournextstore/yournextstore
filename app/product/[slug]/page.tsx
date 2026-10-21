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
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return <div className="aspect-square w-full bg-photon-wash" />;
}

function PurchasePanelSkeleton() {
	return (
		<div className="space-y-3">
			<div className="h-4 w-24 bg-photon-wash" />
			<div className="h-6 w-40 bg-photon-wash" />
			<div className="h-10 w-full max-w-sm bg-photon-wash" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="min-h-svh">
			<div className="grid grid-cols-2 gap-[var(--main-gap)] p-[var(--main-padding)] max-[480px]:grid-cols-1">
				<div className="max-[480px]:order-2">
					<GallerySkeleton />
				</div>
				<div className="space-y-3 px-[var(--main-padding)] pt-[calc(var(--main-padding)*2)]">
					<div className="h-7 w-3/4 bg-photon-wash" />
					<PurchasePanelSkeleton />
				</div>
			</div>
		</div>
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
		<div className="min-h-svh">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}
			<div className="grid grid-cols-2 items-start gap-[var(--main-gap)] p-[var(--main-padding)] max-[480px]:grid-cols-1">
				<div className="w-full max-[480px]:order-2">
					<Suspense fallback={<GallerySkeleton />}>
						<MediaGallery images={allImages} productName={product.name} variants={product.variants} />
					</Suspense>
				</div>

				<div className="w-full space-y-4 px-[var(--main-padding)] pt-[calc(var(--main-padding)*2)]">
					<div>
						<h1 className="text-photon-title">{product.name}</h1>
						{product.category && (
							<p>
								<Link href={`/category/${product.category.slug}`} className="text-muted-foreground">
									{product.category.name}
								</Link>
							</p>
						)}
						{reviewSummary && reviewSummary.reviewCount > 0 && (
							<a href="#reviews">
								{reviewSummary.averageRating.toFixed(1)} / 5 · {reviewSummary.reviewCount}{" "}
								{reviewSummary.reviewCount === 1 ? "review" : "reviews"}
							</a>
						)}
					</div>

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

					{/* Photon's product information: native disclosure rows. */}
					<div className="max-w-prose border-t border-black">
						{product.content && (
							<details open className="group border-b border-black">
								<summary className="flex h-8 cursor-pointer list-none items-center justify-between">
									<h2>Details</h2>
									<span aria-hidden className="group-open:hidden">
										+
									</span>
									<span aria-hidden className="hidden group-open:inline">
										−
									</span>
								</summary>
								<div className="prose prose-sm max-w-none pb-3 text-photon font-normal">
									<TiptapRenderer content={product.content} />
								</div>
							</details>
						)}
						<details className="group border-b border-black">
							<summary className="flex h-8 cursor-pointer list-none items-center justify-between">
								<h2>Shipping &amp; returns</h2>
								<span aria-hidden className="group-open:hidden">
									+
								</span>
								<span aria-hidden className="hidden group-open:inline">
									−
								</span>
							</summary>
							<p className="pb-3 font-normal">
								Shipping and taxes are calculated at checkout. The store&apos;s policies in the footer explain
								delivery and returns.
							</p>
						</details>
					</div>
				</div>
			</div>

			{reviews && <ProductReviews reviews={reviews} slug={slug} />}

			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</div>
	);
};
