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
import { ProductTabs } from "@/app/product/[slug]/product-tabs";
import { RelatedProducts } from "@/app/product/[slug]/related-products";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

// The purchase panel reads useSearchParams (selected variant), so it sits in its own boundary;
// its fallback keeps the panel's height so the page below does not move when it lands.
function PurchasePanelSkeleton() {
	return (
		<div className="space-y-8" aria-hidden="true">
			<div className="h-7 w-40 animate-pulse rounded bg-secondary" />
			<div className="h-24 animate-pulse rounded bg-secondary" />
			<div className="h-16 animate-pulse rounded-full bg-secondary" />
			<div className="h-28" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="shell min-h-svh py-10 lg:py-16" aria-hidden="true">
			<div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
				<div className="aspect-square animate-pulse bg-tile" />
				<div className="space-y-8">
					<div className="h-4 w-48 animate-pulse rounded bg-secondary" />
					<div className="h-12 w-3/4 animate-pulse rounded bg-secondary" />
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
					className={cn("h-4 w-4", i < rounded ? "fill-foreground text-foreground" : "fill-tile text-border")}
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

	const crumbs = [
		{ label: "Home", href: "/" },
		product.category
			? { label: product.category.name, href: `/category/${product.category.slug}` }
			: { label: "Products", href: "/products" },
	];

	const rating =
		reviewSummary && reviewSummary.reviewCount > 0 ? (
			<a href="#product-info" className="inline-flex items-center gap-2 text-sm">
				<StarRow rating={reviewSummary.averageRating} />
				<span>{reviewSummary.averageRating.toFixed(1)}</span>
				<span className="underline underline-offset-2">
					{reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"}
				</span>
			</a>
		) : null;

	const about = (
		<div className="grid gap-10 lg:grid-cols-[2fr_3fr] lg:items-start lg:gap-16">
			{allImages[0] && !isVideoUrl(allImages[0]) ? (
				<div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden bg-tile lg:max-w-none">
					<YNSMedia
						src={allImages[0]}
						alt=""
						fill
						sizes="(max-width: 1024px) 100vw, 460px"
						className="object-cover"
					/>
				</div>
			) : (
				<div />
			)}
			<div>
				<h2 className="text-[2rem] leading-tight font-normal sm:text-4xl">Details &amp; Features</h2>
				<div className="mt-6 max-w-xl text-sm/7 text-muted-foreground">
					{product.content ? (
						<div className="prose prose-sm max-w-none text-sm/7 prose-p:text-muted-foreground prose-strong:text-foreground prose-headings:font-medium">
							<TiptapRenderer content={product.content} />
						</div>
					) : (
						<p className="whitespace-pre-line">{product.summary || "More details coming soon."}</p>
					)}
				</div>
				{product.category && (
					<p className="mt-8 border-t border-border pt-8 text-sm/7">
						<span className="text-foreground">Category</span> <span className="text-muted-foreground">|</span>{" "}
						<Link href={`/category/${product.category.slug}`} className="underline underline-offset-2">
							{product.category.name}
						</Link>
					</p>
				)}
			</div>
		</div>
	);

	return (
		<div className="min-h-svh">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}
			<div className="shell grid gap-10 py-10 lg:grid-cols-2 lg:gap-16 lg:py-16">
				<MediaGallery images={allImages} productName={product.name} />

				<div className="lg:sticky lg:top-32 lg:self-start">
					<nav aria-label="Breadcrumb">
						<ol className="flex flex-wrap items-center gap-2 text-xs uppercase">
							{crumbs.map((crumb) => (
								<li key={crumb.href} className="flex items-center gap-2">
									<Link href={crumb.href} className="hover:underline">
										{crumb.label}
									</Link>
									<span aria-hidden="true" className="text-muted-foreground">
										/
									</span>
								</li>
							))}
							<li aria-current="page" className="text-muted-foreground">
								{product.name}
							</li>
						</ol>
					</nav>
					<h1 className="mt-5 text-4xl leading-[1.1] font-normal text-balance sm:text-5xl">{product.name}</h1>

					<div className="mt-6">
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
									rating={rating}
								/>
							</Suspense>
						)}
					</div>
				</div>
			</div>

			<section id="product-info" aria-label="Product information" className="border-t border-border">
				<div className="shell py-16 lg:py-24">
					<ProductTabs
						tabs={[
							{ id: "about", label: "About", content: about },
							...(reviews
								? [
										{
											id: "reviews",
											label: "Reviews",
											content: <ProductReviews reviews={reviews} slug={slug} />,
										},
									]
								: []),
						]}
					/>
				</div>
			</section>

			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</div>
	);
};
