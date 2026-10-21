import { Star } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCartButton } from "@/app/product/[slug]/add-to-cart-button";
import { BundleBuilder } from "@/app/product/[slug]/bundle-builder";
import { MediaGallery } from "@/app/product/[slug]/media-gallery";
import { ProductReviews } from "@/app/product/[slug]/product-reviews";
import { RelatedProducts } from "@/app/product/[slug]/related-products";
import { CustomerService } from "@/components/sections/home";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { getStoreIdentity } from "@/lib/theme";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return <Skeleton className="aspect-square rounded-md bg-stage md:sticky md:top-28 md:self-start" />;
}

function PurchasePanelSkeleton() {
	return (
		<div className="space-y-6">
			<Skeleton className="h-8 w-32" />
			<Skeleton className="h-[52px] w-full rounded-[16px]" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="shell min-h-svh pt-6 md:pt-10">
			<div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-10 lg:gap-12">
				<GallerySkeleton />
				<div className="space-y-6">
					<Skeleton className="h-14 w-3/4" />
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
						i < rounded ? "fill-foreground text-foreground" : "fill-secondary text-secondary",
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

	const { freeShipping } = await getStoreIdentity();
	const infoSections = [
		...(product.summary
			? [{ title: "Summary", body: <p className="whitespace-pre-line">{product.summary.trim()}</p> }]
			: []),
		...(product.content
			? [
					{
						title: "Description",
						body: (
							<div className="prose prose-sm max-w-none">
								<TiptapRenderer content={product.content} />
							</div>
						),
					},
				]
			: []),
		{
			title: "Shipping & returns",
			body: (
				<p>
					{freeShipping ? `Free delivery on orders over ${freeShipping}. ` : ""}
					Delivery options and costs are shown at checkout. Returns follow the store's policy pages, linked in
					the footer.
				</p>
			),
		},
	];
	const _editorialImage = allImages[1] ?? allImages[0];

	return (
		<div className="min-h-svh">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}
			<div className="shell pt-6 pb-16 md:pt-10 md:pb-24">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-10 lg:gap-12">
					<Suspense fallback={<GallerySkeleton />}>
						<MediaGallery images={allImages} productName={product.name} variants={product.variants} />
					</Suspense>

					<div className="min-w-0">
						<h1 className="text-[2.25rem] leading-[1.2] wrap-break-word text-foreground md:text-[2.625rem]">
							{product.name}
						</h1>
						{reviewSummary && reviewSummary.reviewCount > 0 && (
							<a
								href="#reviews"
								className="mt-3 inline-flex items-center gap-2 text-[13px] transition-opacity hover:opacity-80"
							>
								<span>{reviewSummary.averageRating.toFixed(1)}</span>
								<StarRow rating={reviewSummary.averageRating} />
								<span className="text-muted-foreground underline-offset-4 hover:underline">
									({reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"})
								</span>
							</a>
						)}

						<div className="mt-5">
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
						</div>

						{/* The original's ruled accordion: Belleza rows with a plus that becomes a minus.
						    Plain h2 headings inside <summary> keep heading order right under the h1. */}
						<div className="mt-8 border-t border-border">
							{infoSections.map((section, index) => (
								<details key={section.title} open={index === 0} className="group border-b border-border">
									<summary className="flex cursor-pointer list-none items-center justify-between py-5 [&::-webkit-details-marker]:hidden">
										<h2 className="font-serif text-base">{section.title}</h2>
										<span aria-hidden="true" className="relative flex h-3 w-3 items-center justify-center">
											<span className="absolute h-px w-3 bg-current" />
											<span className="absolute h-3 w-px bg-current transition-transform group-open:scale-y-0" />
										</span>
									</summary>
									<div className="pb-6 text-[13px] leading-relaxed text-foreground">{section.body}</div>
								</details>
							))}
						</div>
					</div>
				</div>

				{/* Reviews Section */}
				{reviews && <ProductReviews reviews={reviews} slug={slug} />}

				<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
			</div>
			<CustomerService />
		</div>
	);
};
