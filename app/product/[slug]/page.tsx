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
import { richTextToPlain } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return (
		<div className="flex flex-col gap-4 lg:col-span-7 lg:sticky lg:top-40 lg:self-start">
			<Skeleton className="aspect-square rounded-xl bg-card" />
		</div>
	);
}

function PurchasePanelSkeleton() {
	return (
		<div className="space-y-6">
			<Skeleton className="h-7 w-24" />
			<Skeleton className="h-12 w-full rounded-md" />
			<Skeleton className="h-[54px] w-48" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="container-page py-6 md:py-10">
			<div className="lg:grid lg:grid-cols-12 lg:gap-12">
				<GallerySkeleton />
				<div className="mt-8 space-y-8 lg:col-span-5 lg:mt-0">
					<Skeleton className="h-12 w-3/4" />
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
					className={cn(
						"h-4 w-4",
						i < rounded ? "fill-foreground text-foreground" : "fill-none text-foreground",
					)}
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

	const description = product.summary;
	const storeName = await getStoreName();
	const details = [
		{ label: "Brand", value: storeName },
		{ label: "Type", value: product.category?.name ?? null },
	].filter((detail) => detail.value);

	return (
		<div className="container-page py-6 md:py-10">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}
			<div className="lg:grid lg:grid-cols-12 lg:gap-12">
				{/* Left: gallery, then the original's Description / Shipping / Returns accordions */}
				<div className="lg:col-span-7">
					<Suspense fallback={<GallerySkeleton />}>
						<MediaGallery images={allImages} productName={product.name} variants={product.variants} />
					</Suspense>
					<h2 className="sr-only max-lg:hidden">Product information</h2>
					<Accordion type="multiple" defaultValue={["description"]} className="mt-6 max-lg:hidden">
						<ProductAccordionItems product={product} description={description} />
					</Accordion>
				</div>

				{/* Right: title, details, price and purchase */}
				<div className="mt-8 space-y-6 lg:col-span-5 lg:mt-0">
					<div className="space-y-3">
						<h1 className="text-[2.25rem] leading-[1.1] text-foreground text-balance md:text-[2.75rem]">
							{product.name}
						</h1>
						{details.length > 0 && (
							<p className="flex flex-wrap gap-x-4 text-[13px] font-semibold text-muted-foreground">
								{details.map((detail) => (
									<span key={detail.label}>
										{detail.label}: {detail.value}
									</span>
								))}
							</p>
						)}
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
								volumePricingTiers={product.volumePricingTiers}
								restockNotificationsEnabled={restockNotificationsEnabled}
							/>
						</Suspense>
					)}

					<h2 className="sr-only lg:hidden">Product information</h2>
					<Accordion type="multiple" defaultValue={["description"]} className="lg:hidden">
						<ProductAccordionItems product={product} description={description} />
					</Accordion>
				</div>
			</div>

			{/* Reviews Section */}
			{reviews && <ProductReviews reviews={reviews} slug={slug} />}

			{/* Related Products */}
			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</div>
	);
};

async function getStoreName() {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	return me?.store.name ?? null;
}

function ProductAccordionItems({
	product,
	description,
}: {
	product: Pick<NonNullable<Awaited<ReturnType<typeof safeProductGet>>>, "content">;
	description: string | null | undefined;
}) {
	const hasContent = Boolean(product.content) && richTextToPlain(product.content).length > 0;
	return (
		<>
			{(hasContent || description) && (
				<AccordionItem value="description" className="border-border">
					<AccordionTrigger className="text-[15px] font-medium hover:no-underline">
						Description
					</AccordionTrigger>
					<AccordionContent>
						{description && <p className="text-sm leading-relaxed text-foreground">{description}</p>}
						{hasContent && (
							<div className="prose prose-sm mt-3 max-w-none text-foreground">
								<TiptapRenderer content={product.content} />
							</div>
						)}
					</AccordionContent>
				</AccordionItem>
			)}
			<AccordionItem value="shipping" className="border-border">
				<AccordionTrigger className="text-[15px] font-medium hover:no-underline">Shipping</AccordionTrigger>
				<AccordionContent className="text-sm leading-relaxed text-foreground">
					Shipping options and costs for your address are shown at checkout before you pay. Most orders leave
					us within a few business days.
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="returns" className="border-border">
				<AccordionTrigger className="text-[15px] font-medium hover:no-underline">Returns</AccordionTrigger>
				<AccordionContent className="text-sm leading-relaxed text-foreground">
					Changed your mind? See our{" "}
					<Link href="/faq" className="underline underline-offset-4">
						help centre
					</Link>{" "}
					for how returns and exchanges work.
				</AccordionContent>
			</AccordionItem>
		</>
	);
}
