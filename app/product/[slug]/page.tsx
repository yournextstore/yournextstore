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
import { type Crumb, Crumbs } from "@/components/crumbs";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return (
		<div className="mx-auto w-full max-w-[20rem] md:w-2/5 md:max-w-none md:shrink-0 md:self-start">
			<div className="rounded bg-muted p-8 lg:p-16">
				<div className="mx-auto h-72 aspect-[2/3] rounded bg-rule md:h-80 xl:h-96" />
			</div>
		</div>
	);
}

function PurchasePanelSkeleton() {
	return (
		<div className="space-y-4 pt-4">
			<Skeleton className="h-20 w-full bg-muted" />
			<Skeleton className="h-6 w-1/2 bg-muted" />
			<Skeleton className="h-6 w-1/2 bg-muted" />
			<Skeleton className="h-11 w-full bg-muted" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="shelf-container min-h-svh py-6">
			<Skeleton className="mb-4 h-6 w-64 bg-muted" />
			<div className="flex flex-col gap-6 md:flex-row md:gap-10 lg:gap-16">
				<GallerySkeleton />
				<div className="md:w-3/5">
					<Skeleton className="h-8 w-3/4 bg-muted" />
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

	const crumbs: Crumb[] = [
		{ label: "Home", href: "/" },
		{ label: "Products", href: "/products" },
		...(product.category
			? [{ label: product.category.name, href: `/category/${product.category.slug}` }]
			: []),
		{ label: product.name },
	];

	return (
		<div className="shelf-container min-h-svh py-6">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}
			<Crumbs items={crumbs} className="mb-4" />
			<div className="mb-12 flex flex-col gap-6 md:flex-row md:gap-10 lg:gap-16">
				<Suspense fallback={<GallerySkeleton />}>
					<MediaGallery images={allImages} productName={product.name} variants={product.variants} />
				</Suspense>

				<div className="md:w-3/5">
					<h1 className="font-sans text-xl font-bold md:text-2xl">{product.name}</h1>
					{reviewSummary && reviewSummary.reviewCount > 0 && (
						<a href="#reviews" className="mt-2 inline-flex items-center gap-2 text-sm hover:opacity-80">
							<StarRow rating={reviewSummary.averageRating} />
							<span className="font-medium">{reviewSummary.averageRating.toFixed(1)}</span>
							<span className="text-muted-foreground">
								({reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"})
							</span>
						</a>
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
								details={
									product.category ? (
										<>
											<dt>Category :</dt>
											<dd className="md:col-span-2 lg:col-span-3">
												<Link href={`/category/${product.category.slug}`} className="link-dashed italic">
													{product.category.name}
												</Link>
											</dd>
										</>
									) : null
								}
								secondaryAction={
									<Link
										href={product.category ? `/category/${product.category.slug}` : "/products"}
										className="btn-outline-shelf w-full border-2 py-2 text-center text-lg font-medium"
									>
										Keep Browsing
									</Link>
								}
							/>
						</Suspense>
					)}
				</div>
			</div>

			{product.content && (
				<section className="mb-12">
					<h2 className="mb-4 font-serif text-2xl font-medium">Details</h2>
					<div className="prose max-w-none text-foreground">
						<TiptapRenderer content={product.content} />
					</div>
				</section>
			)}

			{reviews && <ProductReviews reviews={reviews} slug={slug} />}

			<hr className="border-rule" />
			{/* Related Products */}
			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</div>
	);
};
