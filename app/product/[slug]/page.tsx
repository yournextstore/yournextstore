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
import { Kicker } from "@/components/rack/section-head";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { formatMoney } from "@/lib/money";
import { modelCode, stockTag } from "@/lib/rack";
import { getStoreConfig } from "@/lib/store-config";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return (
		<div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
			<Skeleton className="aspect-[1/1.2] rounded-[14px] bg-panel" />
		</div>
	);
}

function PurchasePanelSkeleton() {
	return (
		<div className="space-y-6">
			<Skeleton className="h-16 w-full bg-panel" />
			<Skeleton className="h-12 w-40 bg-panel" />
			<Skeleton className="h-10 w-32 bg-panel" />
			<Skeleton className="h-14 w-full bg-panel" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="section-x min-h-svh pt-8 pb-24">
			<div className="frame">
				<Skeleton className="mb-8 h-4 w-64 bg-panel" />
				<div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
					<GallerySkeleton />
					<div className="space-y-8">
						<Skeleton className="h-4 w-48 bg-panel" />
						<Skeleton className="h-20 w-3/4 bg-panel" />
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
				<Star key={i} className={cn("h-4 w-4", i < rounded ? "fill-led text-led" : "fill-face text-face")} />
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

	const { currency, locale } = await getStoreConfig();
	const me = await meGetCached().catch(() => null);
	const threshold = me?.store.settings?.freeShippingThreshold;
	const variantCount = product.variants.length;
	const sku = product.variants.length === 1 ? product.variants[0]?.sku : null;
	const spec: [string, string][] = [
		["Model", modelCode(product.name)],
		...(sku ? ([["SKU", sku]] as [string, string][]) : []),
		["Options", variantCount > 1 ? `${variantCount} builds` : "Single build"],
		["Status", stockTag(product.variants).label],
		...(product.category ? ([["Category", product.category.name]] as [string, string][]) : []),
		[
			"Shipping",
			threshold && Number(threshold) > 0
				? `Free over ${formatMoney({ amount: BigInt(threshold), currency, locale })}`
				: "Rates at checkout",
		],
	];

	return (
		<div className="section-x min-h-svh pt-8 pb-[clamp(4rem,9vw,6.5rem)]">
			<div className="frame">
				<JsonLdScript data={productJsonLd} />
				<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
				{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}
				<nav aria-label="Breadcrumb" className="mb-8">
					<ol className="font-plate flex flex-wrap gap-2 text-[0.72rem] tracking-[0.08em] text-faint uppercase">
						<li>
							<Link href="/" className="hover:text-ink">
								Home
							</Link>
						</li>
						<li aria-hidden="true">/</li>
						<li>
							<Link href="/products" className="hover:text-ink">
								The line
							</Link>
						</li>
						{product.category && (
							<>
								<li aria-hidden="true">/</li>
								<li>
									<Link href={`/category/${product.category.slug}`} className="hover:text-ink">
										{product.category.name}
									</Link>
								</li>
							</>
						)}
						<li aria-hidden="true">/</li>
						<li aria-current="page" className="text-signal">
							{product.name}
						</li>
					</ol>
				</nav>
				<div className="grid gap-10 lg:grid-cols-[minmax(0,.95fr)_minmax(0,1.05fr)] lg:gap-14">
					<Suspense fallback={<GallerySkeleton />}>
						<MediaGallery images={allImages} productName={product.name} variants={product.variants} />
					</Suspense>

					<div className="min-w-0 space-y-8">
						<div className="space-y-4">
							<Kicker>{`Module · ${modelCode(product.name)}`}</Kicker>
							<h1 className="title-section text-ink [overflow-wrap:anywhere]">{product.name}</h1>
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

						{/* Configurable bundle → group builder; otherwise the standard variant add-to-cart. */}
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

						<section aria-labelledby="spec-title" className="panel-card p-[clamp(16px,2.4vw,26px)]">
							<h2 id="spec-title" className="kicker mb-3">
								Faceplate readout
							</h2>
							<dl className="flex flex-col">
								{spec.map(([label, value], i) => (
									<div
										key={label}
										className={cn(
											"flex items-baseline justify-between gap-4 py-[11px]",
											i > 0 && "border-t border-line-2",
										)}
									>
										<dt className="plate-label">{label}</dt>
										<dd className="font-plate text-right text-[0.84rem] text-ink">{value}</dd>
									</div>
								))}
							</dl>
						</section>
					</div>
				</div>

				{product.content && (
					<section className="mt-20 grid gap-8 border-t border-line pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
						<div>
							<Kicker className="mb-4">Build notes</Kicker>
							<h2 className="title-section text-ink">The long version.</h2>
						</div>
						<div className="prose dark:prose-invert max-w-none text-dim">
							<TiptapRenderer content={product.content} />
						</div>
					</section>
				)}

				{reviews && <ProductReviews reviews={reviews} slug={slug} />}
			</div>

			<div className="-mx-[1.2rem] -mb-[clamp(4rem,9vw,6.5rem)] mt-[clamp(4rem,9vw,6.5rem)]">
				<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
			</div>
		</div>
	);
};
