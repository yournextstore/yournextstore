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
import { Skeleton } from "@/components/ui/skeleton";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return <Skeleton className="aspect-3/4 bg-card md:sticky md:top-24 md:self-start" />;
}

function PurchasePanelSkeleton() {
	return (
		<div className="space-y-4">
			<Skeleton className="mt-3 h-7 w-28 bg-card" />
			<Skeleton className="mt-6 h-20 w-full bg-card" />
			<Skeleton className="mt-7 h-[50px] w-full bg-card" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="shell min-h-svh">
			<div className="pt-6 text-[13px]">
				<Skeleton className="h-5 w-56 bg-card" />
			</div>
			<div className="grid items-start gap-10 py-4 sm:py-8 md:grid-cols-2 md:gap-14">
				<GallerySkeleton />
				<div>
					<Skeleton className="h-11 w-3/4 bg-card" />
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
					className={cn("h-4 w-4", i < rounded ? "fill-brand text-brand" : "fill-muted text-muted")}
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
		// White content page with black elements (the original's light-section remap); header and footer stay dark.
		<div className="light-section pb-4 sm:pb-6">
			<Suspense fallback={<ProductPageSkeleton />}>
				<ProductDetails params={props.params} />
			</Suspense>
		</div>
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

	const crumb = product.category
		? { href: `/category/${product.category.slug}`, label: product.category.name }
		: { href: "/products", label: "Shop all" };

	return (
		<div className="shell min-h-svh">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{variants[0] && <TrackProductView variant={variants[0]} name={product.name} />}
			<nav aria-label="Breadcrumb" className="pt-6 text-[13px] text-muted-foreground">
				<Link href="/" className="hover:text-foreground">
					Home
				</Link>
				<span aria-hidden className="mx-1.5">
					/
				</span>
				<Link href={crumb.href} className="hover:text-foreground">
					{crumb.label}
				</Link>
				<span aria-hidden className="mx-1.5">
					/
				</span>
				<span aria-current="page" className="text-foreground">
					{product.name}
				</span>
			</nav>

			<section className="grid items-start gap-10 py-4 sm:py-8 md:grid-cols-2 md:gap-14">
				{/* Gallery: sticky beside the details on desktop */}
				<Suspense fallback={<GallerySkeleton />}>
					<MediaGallery images={allImages} productName={product.name} variants={variants} />
				</Suspense>

				<div className="min-w-0">
					{brand && (
						<Link
							href={`/products?brand=${encodeURIComponent(brand.slug)}`}
							className="mb-2 inline-flex min-h-6 items-center text-[12px] font-medium uppercase tracking-[0.2em] text-muted-foreground transition hover:text-foreground"
						>
							{brand.name}
						</Link>
					)}
					<h1 className="wrap-break-word font-display text-[clamp(28px,4vw,40px)] font-bold leading-tight tracking-tight">
						{product.name}
					</h1>
					{reviewSummary && reviewSummary.reviewCount > 0 && (
						<a
							href="#reviews"
							className="mt-2 inline-flex items-center gap-2 text-[13px] transition-opacity hover:opacity-80"
						>
							<StarRow rating={reviewSummary.averageRating} />
							<span className="font-medium">{reviewSummary.averageRating.toFixed(1)}</span>
							<span className="text-muted-foreground underline-offset-4 hover:underline">
								({reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"})
							</span>
						</a>
					)}

					{/* Configurable bundle → group builder; otherwise the standard variant add-to-cart.
					    Renders only for bundle products, so it stays dormant for regular stores. */}
					{product.type === "bundle" && product.bundle?.groups?.length ? (
						<div className="mt-6">
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
						</div>
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

					<div className="mt-8 divide-y divide-border border-y border-border text-[14px]">
						{product.content && (
							<details className="group py-3.5" open>
								<summary className="flex list-none items-center justify-between font-medium [&::-webkit-details-marker]:hidden">
									Details
									<span aria-hidden className="text-muted-foreground transition group-open:rotate-45">
										+
									</span>
								</summary>
								<div className="prose prose-sm max-w-none pb-1 pt-2 text-muted-foreground tiptap-content">
									<TiptapRenderer content={product.content} />
								</div>
							</details>
						)}
						{accordion.map((item) => (
							<details key={item.title} className="group py-3.5">
								<summary className="flex list-none items-center justify-between font-medium [&::-webkit-details-marker]:hidden">
									{item.title}
									<span aria-hidden className="text-muted-foreground transition group-open:rotate-45">
										+
									</span>
								</summary>
								<p className="pb-1 pt-2 leading-relaxed text-muted-foreground">{item.text}</p>
							</details>
						))}
					</div>
				</div>
			</section>

			{/* Reviews Section */}
			{reviews && <ProductReviews reviews={reviews} slug={slug} />}

			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</div>
	);
};

const accordion = [
	{
		title: "Payment",
		text: "Card and wallet payments in one secure step at checkout; your card details never touch our servers.",
	},
	{
		title: "Shipping & returns",
		text: "Delivery options and costs are shown at checkout, before you pay. Return terms are set out in the store policies linked in the footer.",
	},
];
