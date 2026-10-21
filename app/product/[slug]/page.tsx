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
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PaymentMethods } from "@/components/payment-methods";
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
		<div className="grid gap-8 md:col-span-7 md:grid-cols-7">
			<div className="hidden md:col-span-1 md:block">
				<Skeleton className="aspect-square w-full" />
			</div>
			<Skeleton className="aspect-square w-full md:col-span-6" />
		</div>
	);
}

function PurchasePanelSkeleton() {
	return (
		<div className="space-y-4">
			<Skeleton className="h-7 w-28" />
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-14 w-full" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="shop-container min-h-svh">
			<div className="mx-auto max-w-5xl py-4 md:pt-12">
				<Skeleton className="mb-8 h-5 w-64" />
				<div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-8">
					<GallerySkeleton />
					<div className="space-y-4 md:col-span-5">
						<Skeleton className="h-10 w-3/4" />
						<PurchasePanelSkeleton />
					</div>
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
						i < rounded ? "fill-gray-800 text-gray-800" : "fill-gray-200 text-gray-200",
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

	const title = (
		<>
			<h1 className="text-3xl font-semibold tracking-tight text-balance text-foreground lg:text-4xl">
				{product.name}
			</h1>
			{reviewSummary && reviewSummary.reviewCount > 0 && (
				<a href="#reviews" className="mt-2 inline-flex items-center gap-2 text-sm hover:opacity-80">
					<StarRow rating={reviewSummary.averageRating} />
					<span className="font-medium">{reviewSummary.averageRating.toFixed(2)}</span>
					<span className="text-muted-foreground">
						({reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"})
					</span>
				</a>
			)}
		</>
	);

	return (
		<div className="shop-container">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}
			<div className="mx-auto max-w-5xl">
				<Breadcrumbs
					className="mb-8 py-4 md:pt-12"
					items={[
						{ label: "Home", href: "/" },
						...(product.category
							? [{ label: product.category.name, href: `/category/${product.category.slug}` }]
							: [{ label: "All Products", href: "/products" }]),
						{ label: product.name, href: `/product/${product.slug}` },
					]}
				/>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-8">
					<div className="md:hidden">{title}</div>
					<Suspense fallback={<GallerySkeleton />}>
						<MediaGallery images={allImages} productName={product.name} variants={product.variants} />
					</Suspense>

					<section aria-label="Product details" className="flex flex-col gap-4 md:col-span-5">
						<div className="hidden md:block">{title}</div>
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

						<Accordion type="multiple" defaultValue={["details"]} className="mt-4">
							<AccordionItem value="details" className="border-0">
								<AccordionTrigger
									headingLevel="h2"
									className="py-6 text-base font-normal text-ink hover:no-underline"
								>
									Product Details
								</AccordionTrigger>
								<AccordionContent className="rounded-sm bg-slate-50 p-3">
									{product.content ? (
										<div className="prose prose-sm max-w-none text-ink">
											<TiptapRenderer content={product.content} />
										</div>
									) : (
										<ul className="list-disc space-y-1 pl-5 text-ink">
											{product.summary && <li>{product.summary}</li>}
											{product.category && <li>Part of our {product.category.name} range</li>}
											{product.variants.length > 1 && (
												<li>Available in {product.variants.length} variants</li>
											)}
										</ul>
									)}
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="delivery" className="border-0">
								<AccordionTrigger
									headingLevel="h2"
									className="py-6 text-base font-normal text-ink hover:no-underline"
								>
									Delivery and Returns
								</AccordionTrigger>
								<AccordionContent className="leading-relaxed text-ink">
									Shipping options and costs are calculated at checkout for your address. If something is not
									right with your order, get in touch and we will help.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="payment" className="border-0">
								<AccordionTrigger
									headingLevel="h2"
									className="py-6 text-base font-normal text-ink hover:no-underline"
								>
									Secure Payment
								</AccordionTrigger>
								<AccordionContent className="space-y-3 leading-relaxed text-ink">
									<p>Pay securely at checkout with any of the methods below.</p>
									<PaymentMethods />
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</section>
				</div>

				{reviews && <ProductReviews reviews={reviews} slug={slug} />}

				<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
			</div>
		</div>
	);
};
