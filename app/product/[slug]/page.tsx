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
import { summaryParagraphs } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return (
		<div className="flex w-full flex-col gap-2 md:w-1/2">
			<Skeleton className="aspect-[4/5] rounded-none" />
			<Skeleton className="h-14 rounded-none sm:h-[72px]" />
		</div>
	);
}

function PurchasePanelSkeleton() {
	return (
		<div className="flex flex-col gap-4">
			<Skeleton className="h-6 w-24" />
			<div className="my-1.5 h-px w-full bg-border" />
			<Skeleton className="h-8 w-[300px] max-w-full rounded-full" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="frame min-h-svh pt-2 pb-12 md:pb-14">
			<div className="flex flex-col gap-8 md:flex-row md:gap-16">
				<GallerySkeleton />
				<div className="flex w-full flex-col gap-4 md:w-1/2">
					<Skeleton className="h-8 w-3/4" />
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

	const paragraphs = summaryParagraphs(product.summary, product.name);

	return (
		<div className="frame pt-2 pb-12 md:pb-14">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{variants[0] && <TrackProductView variant={variants[0]} name={product.name} />}
			<div className="flex flex-col gap-8 md:flex-row md:gap-16">
				<Suspense fallback={<GallerySkeleton />}>
					<MediaGallery images={allImages} productName={product.name} variants={variants} />
				</Suspense>

				<div className="h-px w-full bg-border md:hidden" />

				<div className="flex w-full min-w-0 flex-col gap-4 md:w-1/2">
					<div className="space-y-2">
						{brand && (
							<Link
								href={`/products?brand=${encodeURIComponent(brand.slug)}`}
								className="inline-flex min-h-6 items-center text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
							>
								{brand.name}
							</Link>
						)}
						<h1 className="text-2xl font-bold text-balance">{product.name}</h1>
						{reviewSummary && reviewSummary.reviewCount > 0 && (
							<a href="#reviews" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
								{reviewSummary.averageRating.toFixed(1)} / 5 · {reviewSummary.reviewCount}{" "}
								{reviewSummary.reviewCount === 1 ? "review" : "reviews"}
							</a>
						)}
					</div>

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
								volumePricingTiers={product.volumePricingTiers}
								restockNotificationsEnabled={restockNotificationsEnabled}
								subscriptionMode={product.subscriptionMode}
								plans={plans}
							/>
						</Suspense>
					)}

					<div className="mt-5 h-px w-full bg-border" />

					{paragraphs.length > 0 || product.content ? (
						<>
							<h2 className="sr-only">Product information</h2>
							<Accordion defaultValue={["description"]} className="w-full">
								<AccordionItem value="description" className="border-none">
									<AccordionTrigger>Description</AccordionTrigger>
									<AccordionContent className="space-y-3 leading-relaxed text-muted-foreground">
										{paragraphs.map((paragraph) => (
											<p key={paragraph}>{paragraph}</p>
										))}
										{product.content ? (
											<div className="prose prose-sm max-w-none tiptap-content">
												<TiptapRenderer content={product.content} />
											</div>
										) : null}
									</AccordionContent>
								</AccordionItem>
							</Accordion>
							<div className="h-px w-full bg-border md:hidden" />
						</>
					) : null}
				</div>
			</div>

			{reviews && <ProductReviews reviews={reviews} slug={slug} />}

			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</div>
	);
};
