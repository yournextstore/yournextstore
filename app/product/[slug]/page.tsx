import { Layers, PackageCheck, Star, Tag, Truck } from "lucide-react";
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
import { RelatedProducts } from "@/app/product/[slug]/related-products";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { summaryParagraphs } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";
import { sentenceCase } from "@/lib/display";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
			<div className="order-last flex gap-4 lg:order-none lg:col-span-1 lg:flex-col">
				{Array.from({ length: 3 }, (_, index) => (
					<Skeleton key={index} className="h-28 w-20 rounded-lg lg:h-32 lg:w-full" />
				))}
			</div>
			<Skeleton className="aspect-[2/3] w-full rounded-lg lg:col-span-4" />
		</div>
	);
}

function PurchasePanelSkeleton() {
	return (
		<div className="flex w-full flex-col gap-8">
			<Skeleton className="mx-auto h-[4.25rem] w-40 md:mx-0" />
			<div className="flex flex-col gap-2.5">
				<Skeleton className="h-12 w-full rounded-lg" />
				<Skeleton className="h-12 w-full rounded-lg" />
			</div>
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="flex min-h-svh w-full justify-center py-6 sm:py-8 lg:py-12">
			<div className="mx-8 grid w-full max-w-[1080px] items-start gap-8 md:grid-cols-2">
				<GallerySkeleton />
				<div className="mx-auto flex w-full max-w-sm flex-col items-center gap-4 md:mx-0 md:items-start">
					<Skeleton className="h-6 w-28" />
					<Skeleton className="h-10 w-3/4" />
					<PurchasePanelSkeleton />
				</div>
			</div>
		</div>
	);
}

function RatingPill({ rating, count }: { rating: number; count: number }) {
	return (
		<a href="#reviews" className="mb-6 inline-flex items-center gap-3 md:mb-10">
			<span className="flex h-7 items-center gap-1 rounded-full bg-sky px-2 text-sm text-ink">
				{rating.toFixed(1)}
				<Star className="size-4 fill-current" aria-hidden />
			</span>
			<span className="text-sm text-muted-foreground">
				{count} {count === 1 ? "review" : "reviews"}
			</span>
		</a>
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
	const stillImages = allImages.filter((image) => !isVideoUrl(image));
	const detailImage = stillImages[1] ?? stillImages[0] ?? null;

	const productJsonLd = await buildProductJsonLd(product, reviews);
	const paragraphs = summaryParagraphs(product.summary, product.name);
	const category = product.category ? sentenceCase(product.category.name) : null;
	const inStock = product.variants.some((variant) => variant.stock !== 0);
	const optionLabels = [
		...new Set(
			product.variants.flatMap((variant) =>
				variant.combinations.map((combination) => sentenceCase(combination.variantValue.variantType.label)),
			),
		),
	];
	const facts = [
		{ icon: Tag, label: "Category", value: category ?? "Accessories" },
		{
			icon: Layers,
			label: "Options",
			value:
				product.variants.length > 1
					? `${product.variants.length} ${optionLabels[0] ? optionLabels[0].toLowerCase() : "options"} to choose from`
					: "One of a kind",
		},
		{ icon: PackageCheck, label: "Availability", value: inStock ? "In stock" : "Sold out" },
		{ icon: Truck, label: "Delivery", value: "Options shown at checkout" },
	];
	const questions = faqCategories
		.flatMap((group) => group.questions)
		// Only the neutral shipping answer: return terms belong on the store's own policy page.
		.filter((entry) => entry.question === "What are your shipping options?");

	return (
		<div className="min-h-svh">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}
			<div className="flex w-full justify-center bg-white py-6 sm:py-8 lg:py-12">
				<div className="mx-8 grid w-full max-w-[1080px] items-start gap-8 md:grid-cols-2 lg:gap-12">
					<div className="min-w-0">
						<Suspense fallback={<GallerySkeleton />}>
							<MediaGallery images={allImages} productName={product.name} variants={product.variants} />
						</Suspense>
					</div>

					<div className="mx-auto flex w-full max-w-sm flex-col items-center text-center md:mx-0 md:block md:text-left">
						<div className="mb-2 md:mb-3">
							{product.category && (
								<Link
									href={`/category/${product.category.slug}`}
									className="mb-0.5 inline-block text-muted-foreground hover:underline"
								>
									{category}
								</Link>
							)}
							<h1 className="text-2xl font-bold text-gray-800 wrap-break-word lg:text-3xl">{product.name}</h1>
						</div>
						{reviewSummary && reviewSummary.reviewCount > 0 ? (
							<RatingPill rating={reviewSummary.averageRating} count={reviewSummary.reviewCount} />
						) : (
							<div className="mb-6 md:mb-10" />
						)}

						{/* Configurable bundle → group builder; otherwise the standard variant add-to-cart. */}
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
						<p className="mt-6 flex items-center justify-center gap-2 text-muted-foreground md:justify-start">
							<Truck className="size-6 shrink-0" strokeWidth={1.5} aria-hidden />
							<span className="text-sm">Delivery options shown at checkout</span>
						</p>
					</div>
				</div>
			</div>

			{(paragraphs.length > 0 || product.content) && (
				<section aria-labelledby="description-heading" className="mx-auto max-w-3xl px-8 pb-8 sm:px-6">
					<h2 id="description-heading" className="sr-only">
						Description
					</h2>
					<div className="flex flex-col gap-3 leading-relaxed text-gray-600">
						{paragraphs.map((paragraph) => (
							<p key={paragraph}>{paragraph}</p>
						))}
					</div>
					{product.content && (
						<div className="prose prose-sm mt-4 max-w-none">
							<TiptapRenderer content={product.content} />
						</div>
					)}
				</section>
			)}

			{category || inStock ? (
				<ul aria-label="Tags" className="mx-auto flex max-w-[56rem] flex-wrap justify-center gap-3 px-8 pb-8">
					{[
						category,
						product.variants.length > 1 ? `${product.variants.length} options` : null,
						inStock ? "Ready to ship" : null,
					]
						.filter((tag): tag is string => Boolean(tag))
						.map((tag) => (
							<li key={tag} className="rounded-full bg-sky px-4 py-1.5 text-sm font-medium text-ink">
								{tag}
							</li>
						))}
				</ul>
			) : null}

			{/* The original's spec panel: four icon facts and a captioned detail photograph. */}
			<section aria-labelledby="details-heading" className="mx-auto max-w-[56rem] px-8 pb-8 sm:px-6">
				<div className="grid items-center gap-6 rounded-lg border border-border bg-gray-50 p-6 md:grid-cols-[1fr_auto] md:p-4 md:pl-8">
					<div>
						<h2 id="details-heading" className="sr-only">
							Details
						</h2>
						<dl className="grid gap-6 sm:grid-cols-2">
							{facts.map(({ icon: Icon, label, value }) => (
								<div key={label} className="flex items-center gap-4">
									<dt className="flex items-center gap-4">
										<span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-sky/40 text-ink">
											<Icon className="size-5" strokeWidth={1.5} aria-hidden />
										</span>
										<span className="sr-only">{label}</span>
									</dt>
									<dd>
										<span aria-hidden className="block text-sm font-semibold text-gray-700">
											{label}
										</span>
										<span className="text-sm text-muted-foreground">{value}</span>
									</dd>
								</div>
							))}
						</dl>
					</div>
					{detailImage && (
						<div className="mx-auto w-full max-w-[13rem] overflow-hidden rounded-lg border border-border bg-white">
							<div className="relative h-40">
								<YNSMedia src={detailImage} alt="" fill sizes="208px" className="object-cover" />
							</div>
							{product.category && (
								<div className="flex items-center justify-between gap-2 p-3 text-sm text-gray-700">
									<span className="truncate">{category}</span>
									<Link
										href={`/category/${product.category.slug}`}
										className="rounded border border-border px-3 py-1 text-xs font-medium text-ink hover:bg-sky-wash"
									>
										More
									</Link>
								</div>
							)}
						</div>
					)}
				</div>
			</section>

			{questions.length > 0 && (
				<section aria-labelledby="questions-heading" className="mx-auto max-w-[56rem] px-8 pb-16 sm:px-6">
					<h2 id="questions-heading" className="sr-only">
						Questions
					</h2>
					<div className="grid gap-4 md:grid-cols-2">
						{questions.map((entry) => (
							<div key={entry.question} className="rounded-lg bg-gray-100 p-6">
								<div className="flex items-start justify-between gap-4 border-b border-gray-300 pb-4">
									<h3 className="text-lg font-semibold text-ink md:text-xl">{entry.question}</h3>
									<span
										aria-hidden
										className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gray-500 text-sm font-bold text-white"
									>
										?
									</span>
								</div>
								<p className="pt-4 text-sm text-muted-foreground md:text-base">{entry.answer}</p>
							</div>
						))}
					</div>
				</section>
			)}

			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />

			{reviews && (
				<div className="mx-auto max-w-[56rem] px-8 pb-16 sm:px-6">
					<ProductReviews reviews={reviews} slug={slug} />
				</div>
			)}
		</div>
	);
};
