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
import { sentenceCase } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return (
		<div className="flex flex-col gap-2">
			<div className="aspect-[2/3] w-full animate-pulse bg-tint" />
		</div>
	);
}

function PurchasePanelSkeleton() {
	return (
		<div className="flex flex-col gap-6">
			<div className="h-[22px] w-28 animate-pulse bg-tint" />
			<div className="h-[50px] w-full animate-pulse bg-tint" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="mx-auto min-h-svh max-w-[1640px] px-4 pt-6 sm:px-5 sm:pt-8 lg:px-9">
			<div className="mb-5 h-[13.5px] w-64 animate-pulse bg-tint sm:mb-8" />
			<div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
				<GallerySkeleton />
				<div className="flex max-w-[560px] flex-col gap-6">
					<div className="h-[30px] w-3/4 animate-pulse bg-tint" />
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

	const categoryName = product.category ? sentenceCase(product.category.name) : null;
	const crumbs = [
		{ href: "/products", label: "Shop" },
		...(product.category && categoryName
			? [{ href: `/category/${product.category.slug}`, label: categoryName }]
			: []),
	];
	const onSale = product.variants.some((v) => BigInt(v.originalPrice ?? v.price) > BigInt(v.price));

	const details: { title: string; body: React.ReactNode }[] = [
		...(product.summary
			? [
					{
						title: "Description",
						body: <p className="whitespace-pre-line">{product.summary.trim()}</p>,
					},
				]
			: []),
		...(product.content
			? [
					{
						title: "Details",
						body: (
							<div className="prose prose-sm max-w-none text-[12px] leading-loose">
								<TiptapRenderer content={product.content} />
							</div>
						),
					},
				]
			: []),
		{
			title: "Delivery & returns",
			body: (
				<p>
					Delivery options and costs are shown at checkout before you pay. Unworn pieces can be returned in
					their original packaging — the details are in the confirmation email.
				</p>
			),
		},
	];

	return (
		<div className="mx-auto max-w-[1640px] px-4 pt-6 sm:px-5 sm:pt-8 lg:px-9">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}
			<nav aria-label="Breadcrumb" className="cap-xs mb-5 truncate text-faint sm:mb-8">
				<Link href="/" className="hover:text-foreground">
					Home
				</Link>
				{crumbs.map((crumb) => (
					<span key={crumb.href}>
						<span aria-hidden> / </span>
						<Link href={crumb.href} className="hover:text-foreground">
							{crumb.label}
						</Link>
					</span>
				))}
				<span aria-hidden> / </span>
				<span aria-current="page">{product.name}</span>
			</nav>

			<article className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-2 lg:gap-16">
				<Suspense fallback={<GallerySkeleton />}>
					<MediaGallery images={allImages} productName={product.name} variants={product.variants} />
				</Suspense>

				<div className="flex max-w-[560px] flex-col gap-6 lg:sticky lg:top-[110px] lg:self-start">
					<div className="flex flex-col gap-3">
						{onSale && <span className="cap-xs w-fit bg-acc px-2.5 py-1.5 text-white">Sale</span>}
						{product.category && categoryName && (
							<Link
								href={`/category/${product.category.slug}`}
								className="cap-xs w-fit text-faint hover:text-foreground"
							>
								{categoryName}
							</Link>
						)}
						<h1 className="text-[20px] font-normal uppercase leading-snug tracking-[0.16em] text-balance sm:text-[24px]">
							{product.name}
						</h1>
						{reviewSummary && reviewSummary.reviewCount > 0 && (
							<a
								href="#reviews"
								className="inline-flex items-center gap-2 text-[11px] transition-opacity hover:opacity-80"
							>
								<StarRow rating={reviewSummary.averageRating} />
								<span>{reviewSummary.averageRating.toFixed(1)}</span>
								<span className="text-faint">
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
								volumePricingTiers={product.volumePricingTiers}
								restockNotificationsEnabled={restockNotificationsEnabled}
							/>
						</Suspense>
					)}

					<div className="border-t border-line">
						{details.map((item, i) => (
							<details key={item.title} className="group border-b border-line" open={i === 0}>
								<summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[10px] uppercase tracking-[0.18em] [&::-webkit-details-marker]:hidden">
									<span>{item.title}</span>
									<span aria-hidden className="group-open:hidden">
										+
									</span>
									<span aria-hidden className="hidden group-open:inline">
										−
									</span>
								</summary>
								<div className="pb-5 text-[12px] leading-loose text-soft">{item.body}</div>
							</details>
						))}
					</div>
				</div>
			</article>

			{reviews && <ProductReviews reviews={reviews} slug={slug} />}

			<RelatedProducts
				productId={product.id}
				category={product.category ? { name: product.category.name, slug: product.category.slug } : null}
			/>
		</div>
	);
};
