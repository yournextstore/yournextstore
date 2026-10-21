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
import { Addons, getCategoryProducts, RelatedProducts } from "@/app/product/[slug]/related-products";
import { SpecAccordion } from "@/components/munch/accordion";
import { headingSizes } from "@/components/munch/styles";
import { MediaText } from "@/components/sections/home";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { EDITORIAL, getAnnouncement, getStoreName } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return (
		<div className="flex w-full gap-2 px-m lg:max-w-171 lg:px-0">
			<div className="hidden w-21.25 shrink-0 flex-col gap-2 lg:flex">
				<Skeleton className="size-21.25 rounded-lg bg-[#f4ebdb]" />
			</div>
			<Skeleton className="mt-1 aspect-square w-[86vw] rounded-2xl bg-[#f4ebdb] lg:mt-0 lg:w-full" />
		</div>
	);
}

function PurchasePanelSkeleton() {
	return (
		<div className="flex flex-col gap-lg">
			<Skeleton className="h-7 w-24 bg-[#f4ebdb]" />
			<Skeleton className="h-20 w-full rounded-full bg-[#f4ebdb]" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="min-h-svh">
			<section className="mx-auto flex max-w-[1440px] flex-col items-start gap-s lg:flex-row lg:gap-xs lg:px-xl lg:py-m">
				<GallerySkeleton />
				<div className="flex w-full flex-col gap-lg px-m pt-s pb-2xl lg:max-w-145">
					<Skeleton className="h-5 w-48 bg-[#f4ebdb]" />
					<Skeleton className="h-14 w-3/4 bg-[#f4ebdb] lg:h-20" />
					<PurchasePanelSkeleton />
				</div>
			</section>
		</div>
	);
}

function StarRow({ rating }: { rating: number }) {
	const rounded = Math.round(rating);
	return (
		<span className="flex gap-0.5" aria-hidden>
			{Array.from({ length: 5 }, (_, i) => (
				<Star key={i} className={cn("h-4 w-4 text-brand", i < rounded ? "fill-brand" : "fill-transparent")} />
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
			<div className="min-h-svh">
				<ProductDetails params={props.params} />
			</div>
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
	const [neighbours, storeName, me] = await Promise.all([
		getCategoryProducts(product.category?.slug),
		getStoreName(),
		meGetCached().catch(() => null),
	]);
	const related = neighbours.filter((p) => p.id !== product.id);
	const addons = related.filter((p) => p.variants.length > 0).slice(0, 2);
	const tag = product.category?.name?.split(">").at(-1)?.trim() ?? null;
	const storeDescription = me?.store.settings?.storeDescription?.trim() || null;
	const shippingNote = await getAnnouncement();

	const specs = [
		...(product.content
			? [
					{
						id: "description",
						title: "Description",
						content: (
							<div className="prose prose-sm max-w-none text-foreground">
								<TiptapRenderer content={product.content} />
							</div>
						),
					},
				]
			: []),
		{
			id: "shipping",
			title: "Shipping",
			content: (
				<p>{shippingNote ? `${shippingNote}. ` : ""}Shipping options and costs are shown at checkout.</p>
			),
		},
	];

	return (
		<>
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}
			<section className="mx-auto flex max-w-[1440px] flex-col items-start gap-s lg:flex-row lg:gap-xs lg:px-xl lg:py-m">
				<Suspense fallback={<GallerySkeleton />}>
					<MediaGallery images={allImages} productName={product.name} variants={product.variants} tag={tag} />
				</Suspense>

				<div className="flex w-full min-w-0 flex-col gap-lg px-m pt-s pb-2xl lg:max-w-145">
					<nav aria-label="Breadcrumb" className="-mb-1 text-b-sm leading-[1.5] lg:text-b-md">
						<Link href="/">Home</Link>
						{product.category && (
							<>
								{" / "}
								<Link href={`/category/${product.category.slug}`}>{product.category.name}</Link>
							</>
						)}
						{" / "}
						<span aria-current="page">{product.name}</span>
					</nav>
					<div className="flex flex-col gap-s">
						<h1 className={cn(headingSizes.product, "text-balance")}>{product.name}</h1>
						{reviewSummary && reviewSummary.reviewCount > 0 && (
							<a href="#reviews" className="inline-flex items-center gap-2 text-b-sm">
								<StarRow rating={reviewSummary.averageRating} />
								<span>{reviewSummary.averageRating.toFixed(1)}</span>
								<span className="underline underline-offset-4">
									({reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"})
								</span>
							</a>
						)}
					</div>

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

					<Addons products={addons} />
					<SpecAccordion items={specs} />
				</div>
			</section>

			{storeDescription && (
				<MediaText
					label={`About ${storeName}`}
					text={storeDescription}
					image={EDITORIAL.about}
					imagePosition="left"
				/>
			)}

			{reviews && (
				<div className="shell">
					<ProductReviews reviews={reviews} slug={slug} />
				</div>
			)}

			<RelatedProducts products={related.slice(0, 8)} />
		</>
	);
};
