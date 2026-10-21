import { Plus, Star } from "lucide-react";
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
import { sentenceCase, splitSummary } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";
import { fitDisplayStep } from "@/lib/display-type";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant), so they need a
// Suspense boundary to keep the rest of the page prerenderable. Skeletons hold the real boxes.
function GallerySkeleton() {
	return (
		<div className="min-w-0">
			<div className="-mx-4 aspect-square rounded-b-photo bg-photo lg:hidden" />
			<div className="hidden grid-cols-2 gap-2 lg:grid">
				<div className="col-span-2 aspect-[4/5] rounded-photo-lg bg-photo" />
			</div>
		</div>
	);
}

function PurchasePanelSkeleton() {
	return (
		<div className="flex flex-col gap-6">
			<Skeleton className="h-8 w-28 rounded-full bg-wash" />
			<Skeleton className="h-16 w-full rounded-full bg-wash" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="min-h-svh pt-0 lg:grid lg:grid-cols-[7fr_5fr] lg:gap-8 lg:pt-6">
			<GallerySkeleton />
			<div className="mt-6 flex flex-col gap-5 lg:mt-0">
				<Skeleton className="h-4 w-40 rounded-full bg-wash" />
				<Skeleton className="h-28 w-4/5 rounded-photo bg-wash" />
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
	const { prose, facts } = splitSummary(product.summary, product.name);
	const reference = product.variants[0]?.sku || product.id.slice(-6).toUpperCase();
	// A product name on its own page is giant when short and steps down as it grows.
	const nameSize = {
		"--name-m": `${fitDisplayStep(product.name, [64, 56, 48, 40, 34, 28], 343, 3)}px`,
		"--name-d": `${fitDisplayStep(product.name, [104, 80, 64, 56, 44], 540, 3)}px`,
	} as React.CSSProperties;

	return (
		<div className="min-h-svh">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}
			<div className="lg:grid lg:grid-cols-[7fr_5fr] lg:gap-8 lg:pt-6">
				<Suspense fallback={<GallerySkeleton />}>
					<MediaGallery images={allImages} productName={product.name} variants={product.variants} />
				</Suspense>

				<div className="mt-6 flex min-w-0 flex-col gap-6 lg:sticky lg:top-[100px] lg:mt-0 lg:self-start">
					<div className="flex flex-col gap-3">
						<p className="text-[13px]">
							{product.category ? (
								<Link href={`/category/${product.category.slug}`} className="hover:underline">
									{sentenceCase(product.category.name)}
								</Link>
							) : (
								<Link href="/products" className="hover:underline">
									New arrivals
								</Link>
							)}
							<span className="text-muted-foreground"> · Ref. {reference}</span>
						</p>
						<h1
							style={nameSize}
							className="font-display text-[length:var(--name-m)] leading-[0.88] wrap-break-word lg:text-[length:var(--name-d)]"
						>
							{product.name}
						</h1>
						{reviewSummary && reviewSummary.reviewCount > 0 && (
							<a
								href="#reviews"
								className="inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
							>
								<StarRow rating={reviewSummary.averageRating} />
								<span className="font-medium">{reviewSummary.averageRating.toFixed(1)}</span>
								<span className="text-muted-foreground underline-offset-4 hover:underline">
									({reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"})
								</span>
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
								volumePricingTiers={product.volumePricingTiers}
								restockNotificationsEnabled={restockNotificationsEnabled}
							/>
						</Suspense>
					)}

					{prose.length > 0 ? <ProductDescription paragraphs={prose} /> : null}

					{facts.length > 0 || product.content ? (
						<div>
							<h2 className="sr-only">Details</h2>
							<div className="border-t border-line">
								{facts.map((fact) => (
									<details key={fact.label} className="group border-b border-line">
										<summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
											{fact.label}
											<Plus
												className="size-4 shrink-0 transition-transform duration-200 group-open:rotate-45"
												aria-hidden="true"
											/>
										</summary>
										<p className="pb-4 text-sm leading-relaxed text-muted-foreground">{fact.text}</p>
									</details>
								))}
								{product.content ? (
									<details className="group border-b border-line">
										<summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
											More about this piece
											<Plus
												className="size-4 shrink-0 transition-transform duration-200 group-open:rotate-45"
												aria-hidden="true"
											/>
										</summary>
										<div className="prose prose-sm max-w-none pb-4 dark:prose-invert">
											<TiptapRenderer content={product.content} />
										</div>
									</details>
								) : null}
							</div>
						</div>
					) : null}
				</div>
			</div>

			{reviews && <ProductReviews reviews={reviews} slug={slug} />}

			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</div>
	);
};

/** The description in body type, its first lines open and the rest behind "Read more". */
function ProductDescription({ paragraphs }: { paragraphs: string[] }) {
	const [first, ...more] = paragraphs;
	return (
		<div className="max-w-[70ch] text-[15px] leading-relaxed text-muted-foreground">
			<p>{first}</p>
			{more.length > 0 ? (
				<details className="group">
					<summary className="mt-2 cursor-pointer list-none text-sm font-medium text-foreground underline underline-offset-[3px] group-open:hidden [&::-webkit-details-marker]:hidden">
						Read more
					</summary>
					<div className="mt-3 flex flex-col gap-3">
						{more.map((paragraph) => (
							<p key={paragraph}>{paragraph}</p>
						))}
					</div>
				</details>
			) : null}
		</div>
	);
}
