import { CircleHelp, CreditCard, MessageCircle, Truck } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCartButton } from "@/app/product/[slug]/add-to-cart-button";
import { BundleBuilder } from "@/app/product/[slug]/bundle-builder";
import { MediaGallery } from "@/app/product/[slug]/media-gallery";
import { ProductReviews, Stars } from "@/app/product/[slug]/product-reviews";
import { RelatedProducts } from "@/app/product/[slug]/related-products";
import { Breadcrumbs } from "@/components/listing";
import { PaymentMethods } from "@/components/payment-methods";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { getBrandMap } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return (
		<div className="product-gallery">
			<div className="gallery-main loading-image" />
		</div>
	);
}

function PurchasePanelSkeleton() {
	return (
		<div className="buy-skeleton" aria-hidden>
			<div className="loading-line short" />
			<div className="loading-title" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="store-width product-page product-page-skeleton">
			<div className="breadcrumbs">
				<div className="loading-line short" />
			</div>
			<div className="product-layout">
				<GallerySkeleton />
				<div className="buy-box">
					<div className="loading-title" />
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

	const brand = product.brandId ? (await getBrandMap())[product.brandId] : undefined;
	const defaultVariant = product.variants[0];
	const optionTypes = [
		...new Set(product.variants.flatMap((v) => v.combinations.map((c) => c.variantValue.variantType.label))),
	];
	const valuesOf = (label: string) => [
		...new Set(
			product.variants.flatMap((v) =>
				v.combinations
					.filter((c) => c.variantValue.variantType.label === label)
					.map((c) => c.variantValue.value),
			),
		),
	];
	const specs: [string, string][] = [
		...(brand ? [["Brand", brand.name] as [string, string]] : []),
		...(product.category ? [["Category", product.category.name] as [string, string]] : []),
		...optionTypes.map((label) => [label, valuesOf(label).join(", ")] as [string, string]),
		...(product.variants.length > 1
			? [["Options", `${product.variants.length} to choose from`] as [string, string]]
			: []),
	];

	return (
		<div className="store-width product-page">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{defaultVariant && <TrackProductView variant={defaultVariant} name={product.name} />}
			<Breadcrumbs
				items={[
					["Home", "/"],
					["All products", "/products"],
					...(product.category
						? [[product.category.name, `/category/${product.category.slug}`] as [string, string]]
						: []),
					[product.name],
				]}
			/>
			<div className="product-layout">
				<Suspense fallback={<GallerySkeleton />}>
					<MediaGallery images={allImages} productName={product.name} variants={product.variants} />
				</Suspense>

				<div className="buy-box">
					{brand && (
						<Link href={`/products?brand=${brand.slug}`} className="buy-brand">
							{brand.name}
						</Link>
					)}
					<h1>{product.name}</h1>
					{reviewSummary && reviewSummary.reviewCount > 0 ? (
						<a href="#reviews" className="buy-rating">
							<Stars value={reviewSummary.averageRating} />
							<span>
								{reviewSummary.averageRating.toFixed(1)} · {reviewSummary.reviewCount}{" "}
								{reviewSummary.reviewCount === 1 ? "review" : "reviews"}
							</span>
						</a>
					) : reviews ? (
						<a href="#reviews" className="buy-rating buy-rating-empty">
							No reviews yet · Write the first
						</a>
					) : null}
					{(product.category || optionTypes.length > 0) && (
						<div className="buy-tags">
							{product.category && (
								<Link href={`/category/${product.category.slug}`} className="chip">
									{product.category.name}
								</Link>
							)}
							{optionTypes.map((label) => (
								<span key={label} className="chip">
									{valuesOf(label).length} {label.toLowerCase()} options
								</span>
							))}
						</div>
					)}

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

					<div className="buy-panel">
						<div className="buy-panel-row">
							<span className="icon-tile sm" aria-hidden>
								<Truck size={15} aria-hidden />
							</span>
							<div>
								<strong>Delivery</strong>
								<small>Options and costs are shown at checkout, before you pay.</small>
							</div>
						</div>
						<div className="buy-panel-row">
							<span className="icon-tile sm" aria-hidden>
								<CreditCard size={15} aria-hidden />
							</span>
							<div>
								<strong>Payment</strong>
								<PaymentMethods className="buy-payments" />
							</div>
						</div>
					</div>
					<div className="buy-help">
						<p>Questions about this product?</p>
						<div>
							<Link href="/faq" className="button sm">
								<CircleHelp size={15} aria-hidden /> FAQ
							</Link>
							<Link href="/contact" className="button sm">
								<MessageCircle size={15} aria-hidden /> Contact us
							</Link>
						</div>
					</div>
					{defaultVariant?.sku && (
						<p className="buy-meta">
							<span>SKU {defaultVariant.sku}</span>
						</p>
					)}
				</div>
			</div>

			<div className="product-info">
				{product.content && (
					<section className="panel product-about">
						<h2>About this product</h2>
						<div className="prose-copy">
							<TiptapRenderer content={product.content} />
						</div>
					</section>
				)}
				{specs.length > 0 && (
					<section className="panel product-specs">
						<h2>Details</h2>
						<dl className="spec-list">
							{specs.map(([term, value]) => (
								<div key={term}>
									<dt>{term}</dt>
									<dd>{value}</dd>
								</div>
							))}
						</dl>
					</section>
				)}
			</div>

			{reviews && <ProductReviews reviews={reviews} slug={slug} productName={product.name} />}

			<RelatedProducts productId={product.id} category={product.category} />
		</div>
	);
};
