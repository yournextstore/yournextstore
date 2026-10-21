import { ArrowRight, CreditCardIcon, EarthIcon, HeadsetIcon, Star } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCartButton } from "@/app/product/[slug]/add-to-cart-button";
import { BundleBuilder } from "@/app/product/[slug]/bundle-builder";
import { MediaGallery } from "@/app/product/[slug]/media-gallery";
import { ProductReviews } from "@/app/product/[slug]/product-reviews";
import { ProductTabs } from "@/app/product/[slug]/product-tabs";
import { RelatedProducts } from "@/app/product/[slug]/related-products";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { getStoreInfo } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return <Skeleton className="aspect-square w-full rounded-lg bg-slate-100 sm:size-113 sm:max-w-full" />;
}

function PurchasePanelSkeleton() {
	return (
		<div>
			<Skeleton className="my-6 h-8 w-28" />
			<Skeleton className="mt-10 h-20 w-64" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="min-h-svh px-6">
			<div className="mx-auto max-w-7xl">
				<Skeleton className="mt-8 mb-5 h-5 w-64" />
				<div className="flex gap-12 max-lg:flex-col">
					<GallerySkeleton />
					<div className="flex-1">
						<Skeleton className="h-9 w-3/4" />
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
						i < rounded ? "fill-go-green-bright text-go-green-bright" : "fill-gray-300 text-gray-300",
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

	const info = await getStoreInfo();
	const perks = [
		{
			Icon: EarthIcon,
			text: info.freeShipping
				? `Free shipping on orders over ${info.freeShipping}`
				: "Delivery options shown at checkout",
		},
		{ Icon: CreditCardIcon, text: "Secure payment at checkout" },
		{ Icon: HeadsetIcon, text: "Questions? See our FAQ and policy pages" },
	];
	const tabs = [
		{
			label: "Description",
			content: product.content ? (
				<div className="prose prose-sm max-w-xl text-slate-600">
					<TiptapRenderer content={product.content} />
				</div>
			) : (
				<p className="max-w-xl">{product.summary || `${product.name} from ${info.storeName}.`}</p>
			),
		},
		...(reviews ? [{ label: "Reviews", content: <ProductReviews reviews={reviews} slug={slug} /> }] : []),
	];

	return (
		<div className="min-h-svh px-6">
			<div className="mx-auto max-w-7xl">
				<JsonLdScript data={productJsonLd} />
				<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
				{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}
				<Breadcrumb className="mt-8 mb-5">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href="/">Home</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href="/products">Products</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						{product.category && (
							<>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbLink asChild>
										<Link href={`/category/${product.category.slug}`}>{product.category.name}</Link>
									</BreadcrumbLink>
								</BreadcrumbItem>
							</>
						)}
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>{product.name}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<div className="flex gap-12 max-lg:flex-col">
					<Suspense fallback={<GallerySkeleton />}>
						<MediaGallery images={allImages} productName={product.name} variants={product.variants} />
					</Suspense>

					<div className="min-w-0 flex-1">
						<h1 className="text-3xl font-semibold text-slate-800">{product.name}</h1>
						{reviewSummary && reviewSummary.reviewCount > 0 && (
							<div className="mt-2 flex items-center">
								<StarRow rating={reviewSummary.averageRating} />
								<p className="ml-3 text-sm text-slate-600">
									{reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "Review" : "Reviews"}
								</p>
							</div>
						)}

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

						<hr className="my-5 border-gray-300" />
						<ul className="flex flex-col gap-4 text-slate-600">
							{perks.map(({ Icon, text }) => (
								<li key={text} className="flex gap-3">
									<Icon className="shrink-0 text-slate-400" aria-hidden />
									{text}
								</li>
							))}
						</ul>
					</div>
				</div>

				<section aria-label="Product information" className="my-18">
					<ProductTabs tabs={tabs} />
					<div className="mt-14 flex gap-3">
						<div
							aria-hidden
							className="flex size-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-lg font-semibold text-go-green-ink uppercase ring ring-slate-400"
						>
							{info.storeName.charAt(0)}
						</div>
						<div className="text-sm">
							<p className="font-medium text-slate-600">Product by {info.storeName}</p>
							<Link href="/products" className="flex items-center gap-1.5 text-go-green-ink hover:gap-2.5">
								view store <ArrowRight size={14} aria-hidden />
							</Link>
						</div>
					</div>
				</section>

				<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
			</div>
		</div>
	);
};
