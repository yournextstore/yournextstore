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
import { sortVariantsByOptions } from "@/app/product/[slug]/variant-order";
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
	return <Skeleton className="aspect-4/5 rounded-md" />;
}

function PurchasePanelSkeleton() {
	return (
		<div className="space-y-6">
			<Skeleton className="h-7 w-32" />
			<Skeleton className="h-16 w-full" />
			<Skeleton className="h-10 w-32" />
			<Skeleton className="h-12 w-full rounded-md" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="page-x min-h-svh pt-6 pb-16 lg:pt-8">
			<div className="lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
				<GallerySkeleton />
				<div className="mt-8 space-y-6 lg:mt-0">
					<Skeleton className="h-4 w-24" />
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
					className={cn("h-4 w-4", i < rounded ? "fill-success text-success" : "fill-muted text-muted")}
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
	// The SDK gives the product a brand id only; an inactive brand isn't shown.
	const brand = product?.brandId
		? await commerce.brandGet({ idOrSlug: product.brandId }).catch(() => null)
		: null;

	return {
		product,
		reviews,
		restockNotificationsEnabled,
		brand: brand?.active ? { name: brand.name, slug: brand.slug } : null,
	};
};

const ProductDetails = async ({ params }: { params: Promise<{ slug: string }> }) => {
	const { slug } = await params;
	const { product, reviews, restockNotificationsEnabled, brand } = await getProductPageData(slug);

	if (!product) {
		notFound();
	}

	const reviewSummary = reviews?.summary ?? null;
	const variants = sortVariantsByOptions(product.variants);

	// The plans a shopper can pick, in the merchant's order. productGet lists inactive plans too, and
	// the cart refuses those.
	const plans = product.subscriptionPlanProducts
		.map(({ subscriptionPlan }) => subscriptionPlan)
		.filter((plan) => plan.active)
		.sort((a, b) => a.position - b.position)
		.map(({ id, name, discountPercent, benefits }) => ({ id, name, discountPercent, benefits }));

	const allImages = [
		...product.images,
		...variants.flatMap((v) => v.images).filter((img) => !product.images.includes(img)),
	];

	const productJsonLd = await buildProductJsonLd(product, reviews, brand?.name ?? null);

	return (
		<div className="pt-6 pb-16 lg:pt-8 lg:pb-24">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{variants[0] && <TrackProductView variant={variants[0]} name={product.name} />}
			<div className="page-x lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
				<Suspense fallback={<GallerySkeleton />}>
					<MediaGallery images={allImages} productName={product.name} variants={variants} />
				</Suspense>

				<div className="mt-8 lg:mt-0">
					<div className="space-y-6 lg:sticky lg:top-24">
						<div className="space-y-3">
							{(brand || product.category) && (
								<div className="flex flex-wrap items-center gap-x-3">
									{brand && (
										<Link
											href={`/products?brand=${encodeURIComponent(brand.slug)}`}
											className="inline-flex min-h-6 items-center text-body-xs uppercase tracking-wide text-muted-foreground hover:text-foreground"
										>
											{brand.name}
										</Link>
									)}
									{product.category && (
										<Link
											href={`/category/${product.category.slug}`}
											className="inline-flex min-h-6 items-center text-body-xs uppercase tracking-wide text-muted-foreground hover:text-foreground"
										>
											{product.category.name}
										</Link>
									)}
								</div>
							)}
							<h1 className="text-heading-xl text-balance">{product.name}</h1>
							{reviewSummary && reviewSummary.reviewCount > 0 && (
								<a href="#reviews" className="inline-flex items-center gap-2 text-body-sm hover:underline">
									<StarRow rating={reviewSummary.averageRating} />
									<span>
										{reviewSummary.averageRating.toFixed(1)} ({reviewSummary.reviewCount}{" "}
										{reviewSummary.reviewCount === 1 ? "review" : "reviews"})
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
									variants={variants}
									product={{
										id: product.id,
										name: product.name,
										slug: product.slug,
										images: product.images,
									}}
									summary={product.summary}
									volumePricingTiers={product.volumePricingTiers}
									restockNotificationsEnabled={restockNotificationsEnabled}
									subscriptionMode={product.subscriptionMode}
									plans={plans}
								/>
							</Suspense>
						)}

						{/* The accordion triggers are h3s; this keeps the outline h1 → h2 → h3. */}
						<h2 className="sr-only">Product information</h2>
						<Accordion multiple className="space-y-3">
							{product.content ? (
								<AccordionItem
									value="description"
									className="rounded-md border border-border px-4 last:border-b"
								>
									<AccordionTrigger className="font-serif text-body font-normal hover:no-underline">
										Description
									</AccordionTrigger>
									<AccordionContent>
										<div className="prose prose-sm max-w-none tiptap-content">
											<TiptapRenderer content={product.content} />
										</div>
									</AccordionContent>
								</AccordionItem>
							) : null}
							<AccordionItem value="shipping" className="rounded-md border border-border px-4 last:border-b">
								<AccordionTrigger className="font-serif text-body font-normal hover:no-underline">
									Shipping
								</AccordionTrigger>
								<AccordionContent className="text-body-sm text-muted-foreground">
									Shipping options and costs are shown at checkout before you pay.
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
				</div>
			</div>

			{/* Reviews Section */}
			{reviews && (
				<div className="page-x">
					<ProductReviews reviews={reviews} slug={slug} />
				</div>
			)}

			{/* Related Products */}
			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</div>
	);
};
