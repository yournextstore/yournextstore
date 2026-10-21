import { Check, Star } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCartButton, PricePill } from "@/app/product/[slug]/add-to-cart-button";
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
	return <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden rounded-xl" />;
}

function PurchasePanelSkeleton() {
	return (
		<div className="mt-6 space-y-6">
			<Skeleton className="h-14 w-full rounded-full bg-white/5" />
		</div>
	);
}

const panel = "rounded-3xl border border-white/10 bg-panel";

function ProductPageSkeleton() {
	return (
		<div className="mx-auto min-h-svh max-w-7xl px-4 py-8 md:px-8">
			<div className="mb-6 h-5" />
			<div className={`${panel} flex flex-col gap-8 p-6 md:p-10 lg:flex-row lg:gap-12`}>
				<div className="w-full basis-full lg:basis-3/5">
					<div className="rounded-2xl border border-white/10 bg-[#0a1214] p-4">
						<Skeleton className="aspect-square max-h-[550px] w-full bg-white/5" />
					</div>
				</div>
				<div className="basis-full space-y-6 lg:basis-2/5">
					<Skeleton className="h-10 w-3/4 bg-white/5" />
					<Skeleton className="h-10 w-40 rounded-full bg-white/5" />
					<PurchasePanelSkeleton />
				</div>
			</div>
		</div>
	);
}

const CHECKLIST = [
	"Chosen with care",
	"Encrypted checkout",
	"Shipping shown at checkout",
	"Questions answered in the FAQ",
];

function StarRow({ rating }: { rating: number }) {
	const rounded = Math.round(rating);
	return (
		<span className="flex gap-0.5" aria-hidden>
			{Array.from({ length: 5 }, (_, i) => (
				<Star
					key={i}
					className={cn("h-4 w-4", i < rounded ? "fill-amber text-amber" : "fill-white/10 text-white/10")}
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

	const summary = product.summary ? (
		<p className="mt-5 mb-6 text-sm leading-relaxed whitespace-pre-line text-[#d4d4d4]">{product.summary}</p>
	) : (
		<div className="mb-6" />
	);
	const categoryName = product.category?.name;
	const categoryHref = product.category?.slug ? `/category/${product.category.slug}` : null;
	const sku = product.variants.length === 1 ? product.variants[0]?.sku : null;

	return (
		<div className="mx-auto min-h-svh max-w-7xl px-4 py-8 md:px-8">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}

			<nav aria-label="Breadcrumb" className="mb-6">
				<ol className="flex flex-wrap items-center gap-2 text-sm text-[#8a9a9c]">
					<li>
						<Link href="/" className="hover:text-amber">
							Home
						</Link>
					</li>
					<li aria-hidden="true">/</li>
					{categoryName && categoryHref ? (
						<>
							<li>
								<Link href={categoryHref} className="hover:text-amber">
									{categoryName}
								</Link>
							</li>
							<li aria-hidden="true">/</li>
						</>
					) : null}
					<li aria-current="page" className="text-[#d4d4d4]">
						{product.name}
					</li>
				</ol>
			</nav>

			<div className={`${panel} flex flex-col gap-8 p-6 md:p-10 lg:flex-row lg:gap-12`}>
				<div className="w-full min-w-0 basis-full lg:basis-3/5">
					<div className="rounded-2xl border border-white/10 bg-[#0a1214] p-4">
						<Suspense fallback={<GallerySkeleton />}>
							<MediaGallery images={allImages} productName={product.name} variants={product.variants} />
						</Suspense>
					</div>
				</div>

				<div className="min-w-0 basis-full lg:basis-2/5">
					<h1 className="text-3xl leading-tight font-normal wrap-break-word md:text-4xl">{product.name}</h1>
					{reviewSummary && reviewSummary.reviewCount > 0 && (
						<a
							href="#reviews"
							className="mt-3 inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
						>
							<StarRow rating={reviewSummary.averageRating} />
							<span className="font-medium">{reviewSummary.averageRating.toFixed(1)}</span>
							<span className="text-[#a3a3a3] underline-offset-4 hover:underline">
								({reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"})
							</span>
						</a>
					)}
					{product.type === "bundle" && product.bundle?.groups?.length ? null : (
						<Suspense fallback={<Skeleton className="mt-4 h-10 w-40 rounded-full bg-white/5" />}>
							<PricePill variants={product.variants} />
						</Suspense>
					)}

					{/* Configurable bundle → group builder; otherwise the standard variant add-to-cart.
					    Renders only for bundle products, so it stays dormant for regular stores. */}
					{product.type === "bundle" && product.bundle?.groups?.length ? (
						<>
							{summary}
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
						</>
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
								description={summary}
								volumePricingTiers={product.volumePricingTiers}
								restockNotificationsEnabled={restockNotificationsEnabled}
							/>
						</Suspense>
					)}

					<ul className="mt-6 grid grid-cols-1 gap-2 text-sm text-[#a3a3a3] sm:grid-cols-2">
						{CHECKLIST.map((item) => (
							<li key={item} className="flex items-start gap-2">
								<Check className="mt-0.5 h-4 w-4 flex-none text-amber" aria-hidden="true" />
								{item}
							</li>
						))}
					</ul>
				</div>
			</div>

			<div className={`${panel} mt-10 grid gap-10 p-6 md:p-10 lg:grid-cols-[1.5fr_1fr]`}>
				<div className="min-w-0">
					<h2 className="mb-4 text-xl font-normal">Details</h2>
					{product.content ? (
						<div className="prose prose-sm max-w-none text-sm leading-relaxed text-[#d4d4d4] prose-invert">
							<TiptapRenderer content={product.content} />
						</div>
					) : (
						<p className="text-sm leading-relaxed text-[#a3a3a3]">
							{product.summary || "Full details for this product are on their way."}
						</p>
					)}
				</div>
				<div>
					<h2 className="mb-4 text-xs font-semibold tracking-[0.16em] text-[#a3a3a3] uppercase">
						Specifications
					</h2>
					<dl className="space-y-2 text-sm">
						{categoryName ? <SpecRow label="Category" value={categoryName} /> : null}
						{sku ? <SpecRow label="SKU" value={sku} mono /> : null}
						<SpecRow
							label="Options"
							value={product.variants.length > 1 ? `${product.variants.length} variants` : "One size"}
						/>
						<SpecRow label="Shipping" value="Calculated at checkout" />
						<SpecRow label="Returns" value="See store policy" />
					</dl>
				</div>
			</div>

			{/* Reviews Section */}
			{reviews && (
				<div className={`${panel} mt-10 px-6 md:px-10`}>
					<ProductReviews reviews={reviews} slug={slug} />
				</div>
			)}

			<RelatedProducts
				productId={product.id}
				categorySlug={product.category?.slug}
				categoryName={categoryName}
			/>
		</div>
	);
};

function SpecRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
	return (
		<div className="flex justify-between gap-4 border-b border-white/10 py-2.5">
			<dt className="shrink-0 text-[#8a9a9c]">{label}</dt>
			<dd className={cn("text-right font-medium text-[#f5f5f5]", mono && "aq-spec")}>{value}</dd>
		</div>
	);
}
