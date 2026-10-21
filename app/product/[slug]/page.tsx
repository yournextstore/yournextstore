import { ChevronRight, Layers, Star } from "lucide-react";
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
import { SectionHead, TextLink } from "@/components/deckle";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { richTextToPlain } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return <div className="aspect-square animate-pulse rounded-frame bg-stage lg:aspect-[6/5]" />;
}

function PurchasePanelSkeleton() {
	return (
		<div className="grid gap-6">
			<div className="h-[4.5rem] border-b border-border pb-6">
				<Skeleton className="h-10 w-40" />
			</div>
			<Skeleton className="h-10 w-full rounded-full" />
			<Skeleton className="h-14 w-full rounded-control" />
		</div>
	);
}

function ProductPageSkeleton() {
	// As tall as a screen: the footer must not paint in the viewport and then jump.
	return (
		<div className="band min-h-svh !pt-6">
			<Skeleton className="h-5 w-48" />
			<div className="mt-6 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
				<GallerySkeleton />
				<div className="grid content-start gap-6">
					<Skeleton className="h-5 w-40" />
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

	const collections = (product.productCollections ?? []).map((pc) => pc.collection).filter(Boolean);
	const collection = collections[0];
	const firstVariant = variants[0];
	const dimensions =
		firstVariant && (firstVariant.width || firstVariant.height || firstVariant.depth)
			? [firstVariant.width, firstVariant.height, firstVariant.depth].filter(Boolean).join(" × ")
			: null;
	const plain = richTextToPlain(product.content);
	const crumbs = [
		{ label: "Products", href: "/products" },
		...(product.category
			? [{ label: product.category.name, href: `/category/${product.category.slug}` }]
			: []),
	];
	const brandHref = brand ? `/products?brand=${encodeURIComponent(brand.slug)}` : null;
	const record: { term: string; detail: React.ReactNode | null }[] = [
		{ term: "Name", detail: product.name },
		...(brand && brandHref ? [{ term: "Brand", detail: <Link href={brandHref}>{brand.name}</Link> }] : []),
		{
			term: "Category",
			detail: product.category ? (
				<Link href={`/category/${product.category.slug}`}>{product.category.name}</Link>
			) : null,
		},
		{
			term: "Collections",
			detail:
				collections.length > 0
					? collections.map((c, i) => (
							<span key={c.id}>
								{i > 0 && ", "}
								<Link href={`/collection/${c.slug}`}>{c.name}</Link>
							</span>
						))
					: null,
		},
		{
			term: "Options",
			detail: variants.length > 1 ? `${variants.length} to choose from` : "One",
		},
		{ term: "SKU", detail: firstVariant?.sku ?? null },
		{ term: "Dimensions", detail: dimensions },
		{ term: "Weight", detail: firstVariant?.weight ? String(firstVariant.weight) : null },
		{ term: "Shipping", detail: firstVariant?.digital ? "Delivered digitally" : "Shipped to your door" },
	];

	return (
		<>
			<section aria-labelledby="product-title" className="band !pt-6">
				<JsonLdScript data={productJsonLd} />
				<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
				{variants[0] && <TrackProductView variant={variants[0]} name={product.name} />}
				<nav aria-label="Breadcrumb">
					<ol className="flex flex-wrap items-center gap-2 text-[0.8125rem] text-muted-foreground">
						{crumbs.map((crumb, index) => (
							<li key={crumb.href} className="inline-flex items-center gap-2">
								{index > 0 && <ChevronRight aria-hidden="true" className="size-3" />}
								<Link href={crumb.href} className="hover:text-foreground">
									{crumb.label}
								</Link>
							</li>
						))}
					</ol>
				</nav>
				<div className="mt-6 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start lg:gap-16">
					<Suspense fallback={<GallerySkeleton />}>
						<MediaGallery images={allImages} productName={product.name} variants={variants} />
					</Suspense>

					{/* Everything needed to choose and buy it, held in view as the picture scrolls. */}
					<div className="grid content-start gap-6 lg:sticky lg:top-24">
						<div className="grid gap-2">
							{(brand || product.category || collection) && (
								<p className="flex flex-wrap items-baseline gap-x-2 text-[0.9375rem]">
									{brand && brandHref && (
										<Link
											href={brandHref}
											className="font-semibold text-copper-ink hover:underline hover:underline-offset-4"
										>
											{brand.name}
										</Link>
									)}
									{product.category && (
										<Link
											href={`/category/${product.category.slug}`}
											className={cn(
												"hover:underline hover:underline-offset-4",
												brand ? "text-muted-foreground" : "font-semibold text-copper-ink",
											)}
										>
											{product.category.name}
										</Link>
									)}
									{collection && <span className="text-muted-foreground">{collection.name}</span>}
								</p>
							)}
							<h1 id="product-title" className="text-title-1 text-balance lg:text-title-display">
								{product.name}
							</h1>
							{product.summary && (
								<p className="mt-1 whitespace-pre-line text-[0.9375rem] text-muted-foreground">
									{product.summary}
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
									variants={variants}
									product={{
										id: product.id,
										name: product.name,
										slug: product.slug,
										images: product.images,
									}}
									callout={
										collection ? (
											<Link
												href={`/collection/${collection.slug}`}
												className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-control px-4 py-3.5 shadow-[inset_0_0_0_1px_var(--border)] transition-shadow hover:shadow-[inset_0_0_0_1px_var(--stroke-strong)]"
											>
												<span className="grid size-9 place-items-center rounded-full bg-copper-wash text-copper">
													<Layers aria-hidden="true" className="size-4" />
												</span>
												<span className="grid text-sm leading-snug">
													<strong className="font-semibold">Part of {collection.name}</strong>
													<span className="text-muted-foreground">See the pieces made to go with it</span>
												</span>
												<ChevronRight aria-hidden="true" className="size-4 text-muted-foreground" />
											</Link>
										) : null
									}
									volumePricingTiers={product.volumePricingTiers}
									restockNotificationsEnabled={restockNotificationsEnabled}
									subscriptionMode={product.subscriptionMode}
									plans={plans}
								/>
							</Suspense>
						)}
					</div>
				</div>
			</section>

			{/* The piece's story, beside a detail of its picture, as the original sets a work's story. */}
			{plain && (
				<section aria-labelledby="story-title" className="band border-t border-border">
					<div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-16">
						<div className="grid content-start gap-4">
							<span className="text-[0.8125rem] font-semibold text-copper-ink">About the piece</span>
							<h2 id="story-title" className="text-title-2 text-balance">
								{product.name}
							</h2>
							<div className="prose max-w-[62ch] text-base dark:prose-invert tiptap-content">
								<TiptapRenderer content={product.content} />
							</div>
						</div>
						{allImages[0] && !isVideoUrl(allImages[0]) && (
							<figure className="grid gap-3">
								<span className="relative block aspect-[4/3] overflow-hidden rounded-frame bg-stage">
									<YNSMedia
										src={allImages[0]}
										alt=""
										fill
										sizes="(max-width: 1024px) 100vw, 40vw"
										className="scale-[1.6] object-cover"
									/>
								</span>
								<figcaption className="text-[0.8125rem] text-muted-foreground">A closer look</figcaption>
							</figure>
						)}
					</div>
				</section>
			)}

			<section aria-labelledby="record-title" className="band bg-band">
				<SectionHead
					id="record-title"
					title="The details"
					action={
						product.category ? (
							<TextLink href={`/category/${product.category.slug}`} arrow>
								More in {product.category.name}
							</TextLink>
						) : undefined
					}
				/>
				<dl className="grid lg:grid-cols-2 lg:gap-x-16">
					{record.map((entry) => (
						<div
							key={entry.term}
							className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-4 border-t border-border py-3.5 text-[0.9375rem] lg:grid-cols-[9rem_minmax(0,1fr)]"
						>
							<dt className="text-muted-foreground">{entry.term}</dt>
							{entry.detail === null ? (
								<dd className="text-faint">Not recorded</dd>
							) : (
								<dd className="[&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-copper-ink">
									{entry.detail}
								</dd>
							)}
						</div>
					))}
				</dl>
			</section>

			{/* Reviews Section */}
			{reviews && (
				<div className="band-x">
					<ProductReviews reviews={reviews} slug={slug} />
				</div>
			)}

			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</>
	);
};
