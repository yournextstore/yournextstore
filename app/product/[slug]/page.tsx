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
import { Em } from "@/components/brand/em";
import { FamilyDot } from "@/components/brand/family-dot";
import { NotesList } from "@/components/notes";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategoryTones, parseNotes, richTextToPlain } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return (
		<div className="grid gap-4 sm:grid-cols-2">
			<Skeleton className="aspect-[4/5] rounded-xl bg-surface" />
			<Skeleton className="hidden aspect-[4/5] rounded-xl bg-surface sm:block" />
		</div>
	);
}

function PurchasePanelSkeleton() {
	return (
		<div className="glass space-y-6 p-6 md:p-7">
			<Skeleton className="h-11 w-48 rounded-full bg-raised" />
			<Skeleton className="h-9 w-32 bg-raised" />
			<Skeleton className="h-12 w-full bg-raised" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="container-page grid gap-12 pb-16 pt-14 md:pb-24 md:pt-18 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
			<GallerySkeleton />
			<div className="space-y-8">
				<Skeleton className="h-4 w-32 bg-surface" />
				<Skeleton className="h-14 w-3/4 bg-surface" />
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
					className={cn("h-4 w-4", i < rounded ? "fill-gold text-gold" : "fill-raised text-raised")}
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

	const tone = product.category ? (await getCategoryTones())[product.category.id] : undefined;
	const notes = parseNotes(product.content);
	const tagline = firstHeading(product.content);

	return (
		<>
			<div className="container-page grid gap-12 pb-16 pt-14 md:pb-24 md:pt-18 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
				<JsonLdScript data={productJsonLd} />
				<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
				{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}
				<Suspense fallback={<GallerySkeleton />}>
					<MediaGallery images={allImages} productName={product.name} variants={product.variants} />
				</Suspense>

				<div className="lg:sticky lg:top-24 lg:self-start">
					{product.category && (
						<Link
							href={`/category/${product.category.slug}`}
							className="eyebrow inline-flex items-center gap-2.5 transition-colors hover:text-ink"
						>
							{tone !== undefined && <FamilyDot index={tone} />}
							{product.category.name}
						</Link>
					)}
					<h1 className="mt-4 font-display text-title-xl text-balance md:text-[3rem] md:leading-[1.05]">
						{product.name}
					</h1>
					{tagline && (
						<p className="mt-3 text-lead">
							<Em>{tagline}</Em>
						</p>
					)}
					{reviewSummary && reviewSummary.reviewCount > 0 && (
						<a
							href="#reviews"
							className="mt-4 inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
						>
							<StarRow rating={reviewSummary.averageRating} />
							<span>{reviewSummary.averageRating.toFixed(1)}</span>
							<span className="text-muted-foreground underline-offset-4 hover:underline">
								({reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"})
							</span>
						</a>
					)}
					{product.summary && (
						<p className="mt-6 max-w-prose whitespace-pre-line text-ink/75">{product.summary}</p>
					)}

					<div className="mt-10">
						{/* Configurable bundle → group builder; otherwise the standard variant add-to-cart.
						    Renders only for bundle products, so it stays dormant for regular stores. */}
						{product.type === "bundle" && product.bundle?.groups?.length ? (
							<div className="glass p-6 md:p-7">
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
									volumePricingTiers={product.volumePricingTiers}
									restockNotificationsEnabled={restockNotificationsEnabled}
								/>
							</Suspense>
						)}
					</div>

					{notes && (
						<section className="glass mt-8 p-6 md:p-7">
							<h2 className="font-display text-xl">Notes</h2>
							<NotesList notes={notes} layout="columns" className="mt-5" />
						</section>
					)}

					{product.content && (
						<details className="group mt-8 border-t border-line pt-6">
							<summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-display text-xl [&::-webkit-details-marker]:hidden">
								The details
								<span aria-hidden="true" className="text-gold transition-transform group-open:rotate-45">
									+
								</span>
							</summary>
							<div className="prose prose-sm prose-invert mt-4 max-w-none text-muted-foreground">
								<TiptapRenderer content={product.content} />
							</div>
						</details>
					)}
				</div>
			</div>

			{reviews && (
				<div className="container-page">
					<ProductReviews reviews={reviews} slug={slug} />
				</div>
			)}

			<RelatedProducts
				productId={product.id}
				categorySlug={product.category?.slug}
				categoryName={product.category?.name}
			/>
		</>
	);
};

/** The first heading in the product copy, set as the gold italic line under the name. */
function firstHeading(content: unknown): string | null {
	if (!content || typeof content !== "object") return null;
	const node = content as { type?: unknown; content?: unknown };
	if (node.type === "heading") return richTextToPlain(node) || null;
	const children = Array.isArray(node.content) ? node.content : [];
	return children.map(firstHeading).find((text) => text) ?? null;
}
