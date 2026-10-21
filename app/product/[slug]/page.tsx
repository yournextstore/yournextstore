import { Star } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { faqCategories } from "@/app/faq/faq-data";
import { AddToCartButton } from "@/app/product/[slug]/add-to-cart-button";
import { BundleBuilder } from "@/app/product/[slug]/bundle-builder";
import { MediaGallery } from "@/app/product/[slug]/media-gallery";
import { ProductReviews } from "@/app/product/[slug]/product-reviews";
import { type ProductTab, ProductTabs } from "@/app/product/[slug]/product-tabs";
import { RelatedProducts } from "@/app/product/[slug]/related-products";
import { sortVariantsByOptions } from "@/app/product/[slug]/variant-order";
import { PageTrail } from "@/components/listing-shell";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { parseSummary } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return (
		<div className="flex flex-col gap-3 lg:grid lg:grid-cols-[111px_minmax(0,1fr)] lg:gap-3.5 xl:grid-cols-[152px_minmax(0,1fr)]">
			<Skeleton className="aspect-square rounded-[13px] bg-tile sm:rounded-[20px] lg:order-2 lg:aspect-[444/530]" />
			<div className="flex gap-3 lg:order-1 lg:flex-col lg:gap-3.5">
				{[0, 1, 2].map((i) => (
					<Skeleton
						key={i}
						className="aspect-[111/106] w-[calc((100vw-3.5rem)/3)] max-w-[111px] rounded-[13px] bg-tile lg:aspect-[152/167] lg:w-full lg:max-w-none xl:rounded-[20px]"
					/>
				))}
			</div>
		</div>
	);
}

function PurchasePanelSkeleton() {
	return (
		<div className="space-y-5">
			<Skeleton className="h-9 w-40 bg-pill" />
			<Skeleton className="h-16 w-full bg-pill" />
			<Skeleton className="h-[52px] w-full rounded-full bg-pill" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="frame min-h-svh">
			<hr className="mb-5 border-black/10 sm:mb-6" />
			<Skeleton className="mb-5 h-5 w-64 bg-pill sm:mb-9" />
			<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
				<GallerySkeleton />
				<div className="space-y-5">
					<Skeleton className="h-10 w-3/4 bg-pill md:h-20" />
					<PurchasePanelSkeleton />
				</div>
			</div>
		</div>
	);
}

function StarRow({ rating }: { rating: number }) {
	const rounded = Math.round(rating);
	return (
		<span className="flex gap-1" aria-hidden>
			{Array.from({ length: 5 }, (_, i) => (
				<Star
					key={i}
					className={cn("size-5 sm:size-6", i < rounded ? "fill-star text-star" : "fill-pill text-pill")}
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
	const { lead, prose, specs } = parseSummary(product.summary, product.name);
	const faqs = faqCategories.flatMap((category) => category.questions).slice(0, 5);

	const tabs: ProductTab[] = [
		{
			id: "details",
			label: "Product Details",
			content: (
				<section>
					<h2 className="mb-5 text-xl font-bold sm:mb-6 sm:text-2xl">Product specifications</h2>
					{product.content ? (
						<div className="prose prose-sm mb-6 max-w-none text-muted-foreground tiptap-content">
							<TiptapRenderer content={product.content} />
						</div>
					) : null}
					{[...(lead ? [lead] : []), ...prose].map((paragraph) => (
						<p key={paragraph} className="mb-4 max-w-3xl text-sm text-muted-foreground sm:text-base">
							{paragraph}
						</p>
					))}
					{specs.length > 0 && (
						<dl>
							{specs.map((spec) => (
								<div
									key={spec.label}
									className="grid grid-cols-3 border-b border-black/10 py-4 text-xs sm:text-sm"
								>
									<dt className="pr-4 text-muted-foreground">{spec.label}</dt>
									<dd className="col-span-2 font-medium">{spec.value}</dd>
								</div>
							))}
						</dl>
					)}
					{!product.content && !lead && prose.length === 0 && specs.length === 0 && (
						<p className="text-sm text-muted-foreground sm:text-base">No further details for this product.</p>
					)}
				</section>
			),
		},
		...(reviews
			? [
					{
						id: "reviews",
						label: "Rating & Reviews",
						content: <ProductReviews reviews={reviews} slug={slug} />,
					},
				]
			: []),
		{
			id: "faqs",
			label: "FAQs",
			content: (
				<section>
					<h2 className="mb-5 text-xl font-bold sm:mb-6 sm:text-2xl">Frequently asked questions</h2>
					<Accordion className="max-w-3xl overflow-visible rounded-none border-none">
						{faqs.map((faq) => (
							<AccordionItem
								key={faq.question}
								value={faq.question}
								className="border-black/10 not-last:border-b data-open:bg-transparent"
							>
								<AccordionTrigger className="px-0 text-base font-medium hover:no-underline">
									{faq.question}
								</AccordionTrigger>
								<AccordionContent className="-mx-4 text-sm text-muted-foreground sm:text-base">
									{faq.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
					<Link href="/faq" className="mt-6 inline-block text-sm font-medium underline underline-offset-4">
						All questions
					</Link>
				</section>
			),
		},
	];

	return (
		<>
			<div className="frame">
				<JsonLdScript data={productJsonLd} />
				<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
				{variants[0] && <TrackProductView variant={variants[0]} name={product.name} />}
				<PageTrail
					crumbs={[
						{ href: "/products", label: "Shop" },
						...(product.category
							? [{ href: `/category/${product.category.slug}`, label: product.category.name }]
							: []),
						{ label: product.name },
					]}
				/>
				<section className="mb-11 grid grid-cols-1 gap-5 md:grid-cols-2">
					<Suspense fallback={<GallerySkeleton />}>
						<MediaGallery images={allImages} productName={product.name} variants={variants} />
					</Suspense>

					<div>
						{brand && (
							<Link
								href={`/products?brand=${encodeURIComponent(brand.slug)}`}
								className="mb-2 inline-flex min-h-6 items-center text-sm text-muted-foreground transition-colors hover:text-black sm:text-base"
							>
								{brand.name}
							</Link>
						)}
						<h1 className="font-display mb-3 text-display-xs wrap-break-word md:mb-3.5 md:text-display-sm lg:text-display-md">
							{product.name}
						</h1>
						{reviewSummary && reviewSummary.reviewCount > 0 && (
							<a href="#reviews" className="mb-3 flex items-center gap-3 text-sm sm:mb-3.5">
								<StarRow rating={reviewSummary.averageRating} />
								<span>
									{reviewSummary.averageRating.toFixed(1)}
									<span className="text-muted-foreground">/5</span>
									<span className="sr-only"> stars, {reviewSummary.reviewCount} reviews</span>
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
									variants={variants}
									product={{
										id: product.id,
										name: product.name,
										slug: product.slug,
										images: product.images,
									}}
									lead={lead}
									volumePricingTiers={product.volumePricingTiers}
									restockNotificationsEnabled={restockNotificationsEnabled}
									subscriptionMode={product.subscriptionMode}
									plans={plans}
								/>
							</Suspense>
						)}
					</div>
				</section>

				<ProductTabs tabs={tabs} />
			</div>

			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</>
	);
};
