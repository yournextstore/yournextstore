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
import { CtaBand } from "@/components/garden/cta-band";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return <div className="photo animate-pulse" />;
}

function PurchasePanelSkeleton() {
	return (
		<div className="buy space-y-4">
			<Skeleton className="h-9 w-40 bg-[var(--paper-3)]" />
			<Skeleton className="h-5 w-24 bg-[var(--paper-3)]" />
			<Skeleton className="h-12 w-full rounded-full bg-[var(--paper-3)]" />
			<Skeleton className="h-20 w-full bg-[var(--paper-3)]" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="wrap min-h-svh pt-[clamp(1.6rem,3.4vw,2.6rem)]">
			<Skeleton className="mb-6 h-4 w-64 bg-[var(--paper-3)]" />
			<div className="pdp__top">
				<div className="pdp__media">
					<GallerySkeleton />
				</div>
				<div className="pdp__intro space-y-4">
					<Skeleton className="h-6 w-32 bg-[var(--paper-3)]" />
					<Skeleton className="h-12 w-3/4 bg-[var(--paper-3)]" />
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

	const firstVariant = product.variants[0];
	const variantCount = product.variants.length;
	const stock = product.variants.reduce<number | null>(
		(sum, v) => (sum === null || v.stock === null ? null : sum + v.stock),
		0,
	);
	const options = [
		...new Set(product.variants.flatMap((v) => v.combinations.map((c) => c.variantValue.variantType.label))),
	];
	const specs = [
		product.category ? { label: "Category", value: product.category.name } : null,
		options.length > 0 ? { label: "Options", value: options.join(", ") } : null,
		{ label: "Variants", value: variantCount === 1 ? "One size" : `${variantCount} versions` },
		firstVariant?.sku && variantCount === 1 ? { label: "SKU", value: firstVariant.sku } : null,
		{
			label: "Availability",
			value:
				stock === null ? "In stock" : stock === 0 ? "Sold out" : stock <= 5 ? `${stock} left` : "In stock",
		},
	].filter((spec) => spec !== null);

	return (
		<>
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{firstVariant && <TrackProductView variant={firstVariant} name={product.name} />}
			<div className="wrap pb-[clamp(3rem,7vw,5.5rem)]">
				<nav aria-label="Breadcrumb" className="pt-[clamp(1.6rem,3.4vw,2.6rem)] pb-4">
					<ol className="crumbs">
						<li>
							<Link href="/">Home</Link>
						</li>
						<li aria-hidden="true">/</li>
						<li>
							<Link href="/products">Shop</Link>
						</li>
						{product.category && (
							<>
								<li aria-hidden="true">/</li>
								<li>
									<Link href={`/category/${product.category.slug}`}>{product.category.name}</Link>
								</li>
							</>
						)}
						<li aria-hidden="true">/</li>
						<li aria-current="page" className="text-[var(--ink-2)]">
							{product.name}
						</li>
					</ol>
				</nav>
				<div className="pdp__top">
					<div className="pdp__media min-w-0">
						<Suspense fallback={<GallerySkeleton />}>
							<MediaGallery images={allImages} productName={product.name} variants={product.variants} />
						</Suspense>
						<p className="pdp__plate">
							<span className="hand">No. {String((product.name.length % 9) + 1).padStart(2, "0")}</span>
							<span className="caption">A closer look, from every side we have.</span>
						</p>
					</div>

					<div className="pdp__intro">
						<span className="eyebrow-script with-line">{product.category?.name ?? "From the shop"}</span>
						<h1>{product.name}</h1>
						{reviewSummary && reviewSummary.reviewCount > 0 && (
							<a
								href="#reviews"
								className="mt-3 inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
							>
								<StarRow rating={reviewSummary.averageRating} />
								<span className="font-medium">{reviewSummary.averageRating.toFixed(1)}</span>
								<span className="text-[var(--ink-3)] underline-offset-4 hover:underline">
									({reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"})
								</span>
							</a>
						)}
						{product.summary && <p className="lede">{product.summary}</p>}

						{/* Configurable bundle → group builder; otherwise the standard variant add-to-cart.
						    Renders only for bundle products, so it stays dormant for regular stores. */}
						{product.type === "bundle" && product.bundle?.groups?.length ? (
							<div className="buy">
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
									category={product.category?.name ?? null}
									volumePricingTiers={product.volumePricingTiers}
									restockNotificationsEnabled={restockNotificationsEnabled}
								/>
							</Suspense>
						)}

						<dl className="pdp__quick">
							{specs
								.filter((spec) => spec.label !== "Category")
								.slice(0, 3)
								.map((spec) => (
									<div key={spec.label}>
										<dt>{spec.label}</dt>
										<dd>{spec.value}</dd>
									</div>
								))}
						</dl>
					</div>
				</div>
			</div>

			<section className="section bg-[var(--paper-hand)]" aria-labelledby="about-piece">
				<div className="wrap pdp__story">
					<div>
						<h2 id="about-piece" className="eyebrow-script with-line">
							About this piece
						</h2>
						<div className="pdp__prose">
							{product.content ? (
								<TiptapRenderer content={product.content} />
							) : (
								<p>
									{product.name} is one of the things we grow or use on our own benches. Questions about size,
									light or looking after it? Our FAQ covers the basics, or simply ask us.
								</p>
							)}
						</div>
					</div>
					<aside className="pdp__side" aria-labelledby="details-title">
						<h2 id="details-title">Details</h2>
						<dl className="pdp__specs">
							{specs.map((spec) => (
								<div key={spec.label}>
									<dt>{spec.label}</dt>
									<dd>{spec.value}</dd>
								</div>
							))}
						</dl>
					</aside>
				</div>
			</section>

			{reviews && (
				<div className="wrap">
					<ProductReviews reviews={reviews} slug={slug} />
				</div>
			)}

			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />

			<CtaBand />
		</>
	);
};
