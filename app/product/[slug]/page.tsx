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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return (
		<div className="flex flex-col gap-5 md:flex-row md:gap-8">
			<Skeleton className="aspect-square w-full rounded-none md:order-2 md:max-w-2xl md:grow" />
			<div className="hidden md:order-1 md:block md:w-[108px]" />
		</div>
	);
}

function PurchasePanelSkeleton() {
	return (
		<div className="space-y-6">
			<Skeleton className="h-8 w-32 rounded-none" />
			<Skeleton className="h-12 w-36 rounded-full" />
			<Skeleton className="h-10 w-56 rounded-none" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="shell min-h-svh pt-6 pb-8 md:py-8">
			<div className="grid grid-cols-12 gap-y-8 md:gap-x-8">
				<div className="col-span-12 md:col-span-7">
					<GallerySkeleton />
				</div>
				<div className="col-span-12 space-y-4 md:col-span-5">
					<Skeleton className="h-10 w-3/4 rounded-none" />
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

	return (
		<div className="shell min-h-svh pt-6 pb-8 md:py-8">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}
			<div className="grid grid-cols-12 gap-y-8 md:gap-x-8">
				<div className="relative col-span-12 min-w-0 md:col-span-7">
					<Suspense fallback={<GallerySkeleton />}>
						<MediaGallery images={allImages} productName={product.name} variants={product.variants} />
					</Suspense>
				</div>

				<div className="col-span-12 max-w-lg md:col-span-5">
					<div className="mb-3 space-y-3">
						<h1 className="text-3xl font-semibold tracking-wide md:text-4xl">{product.name}</h1>
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

					<section className="mt-4">
						<h2 className="sr-only">Product information</h2>
						<Accordion type="single" collapsible defaultValue={product.content ? "details" : undefined}>
							{product.content && (
								<AccordionItem value="details">
									<AccordionTrigger className="text-base font-semibold">Details</AccordionTrigger>
									<AccordionContent>
										<div className="prose prose-sm max-w-none">
											<TiptapRenderer content={product.content} />
										</div>
									</AccordionContent>
								</AccordionItem>
							)}
							{product.category && (
								<AccordionItem value="category">
									<AccordionTrigger className="text-base font-semibold">
										More in {product.category.name}
									</AccordionTrigger>
									<AccordionContent>
										<Link
											href={`/category/${product.category.slug}`}
											className="underline underline-offset-4"
										>
											Browse the {product.category.name} range
										</Link>
									</AccordionContent>
								</AccordionItem>
							)}
							<AccordionItem value="shipping">
								<AccordionTrigger className="text-base font-semibold">Ship &amp; Returns</AccordionTrigger>
								<AccordionContent className="leading-relaxed">
									Shipping costs and delivery options are shown at checkout. Returns follow the store&apos;s
									policies, linked at the foot of every page.
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</section>
				</div>
			</div>

			{/* Reviews Section */}
			{reviews && <ProductReviews reviews={reviews} slug={slug} />}

			{/* Related Products */}
			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</div>
	);
};
