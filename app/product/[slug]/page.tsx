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
import { displayName, parseSummary, toPieces } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { savedOf } from "@/lib/saved";
import { TrackProductView } from "@/lib/track";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return <div className="hatch aspect-[2/3] border border-line" />;
}

function PurchasePanelSkeleton() {
	return (
		<div className="flex flex-col">
			<div className="h-[47px] border-t border-line" />
			<div className="mt-3 flex items-center gap-[14px] border-t border-rule pt-5">
				<div className="h-6 w-28 bg-tint" />
				<span className="flex-1" />
				<div className="h-[42px] w-[42px] rounded-full bg-tint" />
				<div className="h-[42px] w-36 bg-tint" />
			</div>
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="mx-auto min-h-svh max-w-[1100px] px-4 sm:px-6">
			<div className="mt-10 h-3 w-64 bg-tint" />
			<div className="flex flex-wrap items-start gap-x-14 gap-y-9 pb-16 pt-8">
				<div className="min-w-0 flex-[1_1_380px]">
					<GallerySkeleton />
				</div>
				<div className="flex min-w-0 flex-[1_1_380px] flex-col gap-5 md:pt-2">
					<div className="h-3 w-32 bg-tint" />
					<div className="h-12 w-3/4 bg-tint" />
					<div className="h-24 w-full bg-tint" />
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
	const [piece] = await toPieces([product]);
	const { blocks, specs } = parseSummary(product.summary, product.name);
	const [lead, ...rest] = blocks;
	const department = product.category ? displayName(product.category.name) : null;
	const reviewSummary = reviews?.summary ?? null;
	const optionRows = (piece?.options ?? [])
		.filter((group) => group.values.length > 1)
		.map((group): [string, string] => [displayName(group.label), `${group.values.length} to choose from`]);
	const ledger: [string, string][] = [
		["Reference", `No. ${piece?.no ?? "—"}`],
		...(brand ? [["Maker", brand.name] as [string, string]] : []),
		...(department ? [["Department", department] as [string, string]] : []),
		...specs,
		...optionRows,
		...(reviewSummary && reviewSummary.reviewCount > 0
			? [
					[
						"Patron rating",
						`${reviewSummary.averageRating.toFixed(1)}★ · ${reviewSummary.reviewCount} ${reviewSummary.reviewCount === 1 ? "review" : "reviews"}`,
					] as [string, string],
				]
			: []),
	];

	return (
		<div className="mx-auto min-h-svh max-w-[1100px] px-4 sm:px-6">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{variants[0] && <TrackProductView variant={variants[0]} name={product.name} />}
			<nav aria-label="Breadcrumb" className="eti flex flex-wrap gap-x-2.5 gap-y-1 pt-10 text-faint">
				<Link href="/products" className="transition hover:text-acc">
					All pieces
				</Link>
				{product.category ? (
					<>
						<span aria-hidden>/</span>
						<Link href={`/category/${product.category.slug}`} className="transition hover:text-acc">
							{department}
						</Link>
					</>
				) : null}
				<span aria-hidden>/</span>
				<span aria-current="page" className="text-ink">
					No. {piece?.no}
				</span>
			</nav>

			<section className="flex flex-wrap items-start gap-x-14 gap-y-9 pb-16 pt-8">
				<div className="min-w-0 flex-[1_1_380px]">
					<Suspense fallback={<GallerySkeleton />}>
						<MediaGallery images={allImages} productName={product.name} variants={variants} />
					</Suspense>
				</div>

				<div className="flex min-w-0 flex-[1_1_380px] flex-col gap-5 md:pt-2">
					{department ? <span className="eti text-faint">{department}</span> : null}
					<h1 className="font-sf text-[clamp(28px,4vw,42px)] leading-[1.12] tracking-[-0.01em] wrap-break-word">
						{product.name}
					</h1>
					{lead ? <p className="text-[14.5px] leading-[1.75] text-soft">{lead.text}</p> : null}
					{rest.length > 0 ? (
						<details className="group">
							<summary className="link-rule inline-block list-none text-acc [&::-webkit-details-marker]:hidden">
								<span className="group-open:hidden">Read the full description</span>
								<span className="hidden group-open:inline">Fold the description</span>
							</summary>
							<div className="mt-4 flex flex-col gap-3">
								{rest.map((block, index) =>
									block.kind === "head" ? (
										<h2 key={`${index}-${block.text}`} className="eti mt-2 text-dim">
											{block.text}
										</h2>
									) : (
										<p key={`${index}-${block.text}`} className="text-[14px] leading-[1.75] text-soft">
											{block.text}
										</p>
									),
								)}
							</div>
						</details>
					) : null}

					<div className="flex flex-col">
						{ledger.map(([label, value]) => (
							<div key={label} className="flex flex-wrap gap-x-[18px] gap-y-1 border-t border-line py-3">
								<span className="eti w-[140px] flex-none text-faint">{label}</span>
								<span className="min-w-0 flex-1 text-[13.5px] text-ink">{value}</span>
							</div>
						))}

						{/* Configurable bundle → group builder; otherwise the standard variant add-to-cart.
						    Renders only for bundle products, so it stays dormant for regular stores. */}
						{product.type === "bundle" && product.bundle?.groups?.length ? (
							<div className="border-t border-rule pt-5">
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
									saved={
										piece
											? savedOf(piece)
											: {
													slug: product.slug,
													href: `/product/${product.slug}`,
													name: product.name,
													no: "—",
													image: allImages[0] ?? null,
													priceLabel: "",
												}
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

			{product.content && (
				<section className="border-t border-line py-10">
					<h2 className="eti mb-6 tracking-[0.16em] text-dim">From the register</h2>
					<div className="prose prose-sm max-w-[68ch] text-soft tiptap-content">
						<TiptapRenderer content={product.content} />
					</div>
				</section>
			)}

			{reviews && <ProductReviews reviews={reviews} slug={slug} />}

			<RelatedProducts
				productId={product.id}
				categorySlug={product.category?.slug}
				categoryName={department ?? undefined}
			/>
		</div>
	);
};
