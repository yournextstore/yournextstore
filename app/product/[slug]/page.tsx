import { Headset, Lock, PackageCheck, Star, Truck } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCartButton, ProductPrice } from "@/app/product/[slug]/add-to-cart-button";
import { BundleBuilder } from "@/app/product/[slug]/bundle-builder";
import { MediaGallery } from "@/app/product/[slug]/media-gallery";
import { ProductReviews } from "@/app/product/[slug]/product-reviews";
import { RelatedProducts } from "@/app/product/[slug]/related-products";
import { sortVariantsByOptions } from "@/app/product/[slug]/variant-order";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { summaryParagraphs } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return (
		<div className="-mx-4 md:mx-0 md:flex md:gap-4">
			<div className="hidden w-[4.5rem] shrink-0 flex-col gap-3 md:flex xl:w-20">
				{Array.from({ length: 4 }, (_, index) => (
					<Skeleton key={index} className="aspect-[3/4] rounded-sm" />
				))}
			</div>
			<Skeleton className="aspect-[3/4] flex-1 rounded-none" />
		</div>
	);
}

function PurchasePanelSkeleton() {
	return (
		<div className="flex flex-col gap-6">
			<Skeleton className="h-[3.125rem] w-full rounded" />
			<Skeleton className="h-24 w-full" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="bp-container min-h-svh pb-12 pt-6 md:grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-x-10 md:pt-10 xl:gap-x-16">
			<GallerySkeleton />
			<div className="mt-6 flex flex-col gap-4 md:mt-0">
				<Skeleton className="h-12 w-3/4" />
				<Skeleton className="h-6 w-24" />
				<PurchasePanelSkeleton />
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
						i < rounded ? "fill-black text-black" : "fill-neutral-lighter text-neutral-lighter",
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

	// The opening of the summary sits under the button; the rest folds into "Details".
	const paragraphs = summaryParagraphs(product.summary, product.name);
	// Lead: up to and including the first real paragraph (short label lines ride along), at most three.
	const firstProse = paragraphs.findIndex((paragraph) => paragraph.length > 120);
	const splitAt = firstProse === -1 ? Math.min(paragraphs.length, 3) : Math.min(firstProse + 1, 3);
	const lead = paragraphs.slice(0, splitAt);
	const rest = paragraphs.slice(splitAt);
	const subline =
		product.variants.length > 1 ? `${product.variants.length} options` : (product.category?.name ?? null);

	return (
		<div className="min-h-svh">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{variants[0] && <TrackProductView variant={variants[0]} name={product.name} />}
			<div className="bp-container pb-12 pt-6 md:grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:grid-rows-[auto_1fr] md:gap-x-10 md:pt-10 md:[grid-template-areas:'gallery_head''gallery_body'] xl:gap-x-16">
				<div className="flex flex-col gap-2 border-b border-border pb-5 md:[grid-area:head]">
					{reviewSummary && reviewSummary.reviewCount > 0 && (
						<a href="#reviews" className="inline-flex items-center gap-2 text-xs">
							<StarRow rating={reviewSummary.averageRating} />
							<span className="underline underline-offset-2">
								({reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "Review" : "Reviews"})
							</span>
						</a>
					)}
					{(product.category || brand) && (
						<div className="flex flex-wrap items-center gap-x-4">
							{product.category && (
								<Link
									href={`/category/${product.category.slug}`}
									className="bp-superheading inline-flex min-h-6 w-fit items-center hover-underline"
								>
									{product.category.name}
								</Link>
							)}
							{brand && (
								<Link
									href={`/products?brand=${encodeURIComponent(brand.slug)}`}
									className="bp-superheading inline-flex min-h-6 w-fit items-center hover-underline"
								>
									{brand.name}
								</Link>
							)}
						</div>
					)}
					<h1 className="text-3xl font-bold leading-tight wrap-break-word md:text-4xl xl:text-[2.625rem]">
						{product.name}
					</h1>
					{subline && <p className="text-base capitalize">{subline}</p>}
					<Suspense fallback={<div className="min-h-7" />}>
						<ProductPrice variants={variants} />
					</Suspense>
				</div>

				<div className="mt-5 md:mt-0 md:[grid-area:gallery]">
					<Suspense fallback={<GallerySkeleton />}>
						<MediaGallery images={allImages} productName={product.name} variants={variants} />
					</Suspense>
				</div>

				<div className="mt-6 flex flex-col gap-6 md:[grid-area:body]">
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
								volumePricingTiers={product.volumePricingTiers}
								restockNotificationsEnabled={restockNotificationsEnabled}
								subscriptionMode={product.subscriptionMode}
								plans={plans}
							/>
						</Suspense>
					)}

					{lead.length > 0 && (
						<div className="flex flex-col gap-3 text-sm leading-6">
							{lead.map((paragraph) => (
								<p key={paragraph}>{paragraph}</p>
							))}
						</div>
					)}

					{/* Plain rows, not Radix: its header renders an h3 straight under the h1. */}
					<div className="flex flex-col gap-3">
						{(rest.length > 0 || product.content) && (
							<InfoRow title="Details">
								{rest.length > 0 && (
									<div className="flex flex-col gap-3">
										{rest.map((paragraph) => (
											<p key={paragraph}>{paragraph}</p>
										))}
									</div>
								)}
								{product.content && (
									<div className="prose prose-sm mt-3 max-w-none tiptap-content">
										<TiptapRenderer content={product.content} />
									</div>
								)}
							</InfoRow>
						)}
						<InfoRow title="Shipping & returns">
							<p>
								Delivery options and their costs are shown at checkout, before you pay. Answers about delivery
								times and returns are in our{" "}
								<Link href="/faq" className="underline underline-offset-2">
									FAQ
								</Link>
								.
							</p>
						</InfoRow>
						<InfoRow title="Secure payment">
							<p>
								Checkout is encrypted end to end. Pay by card or with the local methods offered at checkout.
							</p>
						</InfoRow>
					</div>
				</div>
			</div>

			{/* Reviews Section */}
			{reviews && (
				<div className="bp-container">
					<ProductReviews reviews={reviews} slug={slug} />
				</div>
			)}

			<IconRow />

			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</div>
	);
};

function InfoRow({
	title,
	open = false,
	children,
}: {
	title: string;
	open?: boolean;
	children: React.ReactNode;
}) {
	return (
		<details open={open} className="group rounded bg-neutral-lightest">
			<summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-4 text-sm font-bold [&::-webkit-details-marker]:hidden">
				{title}
				<span aria-hidden className="relative size-3.5 shrink-0">
					<span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
					<span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-transform group-open:scale-y-0" />
				</span>
			</summary>
			<div className="px-4 pb-5 text-sm leading-6">{children}</div>
		</details>
	);
}

const ICONS = [
	{ icon: Truck, label: "Delivery Options" },
	{ icon: Lock, label: "Secure Checkout" },
	{ icon: PackageCheck, label: "Careful Packing" },
	{ icon: Headset, label: "Personal Support" },
] as const;

/** Blueprint's icon row: centred heading, a line of copy, four green line icons. */
function IconRow() {
	return (
		<section className="bp-container py-12 text-center md:py-16">
			<h2 className="bp-h3">Shop With Confidence</h2>
			<p className="mx-auto mt-4 max-w-2xl text-base">
				Every order is packed with care, and we are here if anything needs sorting out.
			</p>
			<ul className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
				{ICONS.map(({ icon: Icon, label }) => (
					<li key={label} className="flex flex-col items-center gap-3">
						<Icon className="size-10 text-brand" strokeWidth={1.25} aria-hidden />
						<span className="text-base font-bold leading-snug">{label}</span>
					</li>
				))}
			</ul>
		</section>
	);
}
