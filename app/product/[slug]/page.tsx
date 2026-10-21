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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { colorThemeFor } from "@/lib/color-theme";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// Mirrors the widget's own rows (name, category, price, quantity, two buttons) so the page
// below does not move when the client part, which reads the selected variant, takes over.
function WidgetSkeleton({ name, category }: { name: string; category?: string }) {
	return (
		<div className="pointer-events-auto rounded-md bg-white px-4 py-6 shadow-tile md:px-6">
			<div className="text-ui-md font-bold uppercase">{name}</div>
			{category && <div className="mt-1 text-ui-md text-darkgray">{category}</div>}
			<Skeleton className="mt-2 h-[1.1rem] w-20" />
			<div className="my-4 border-b border-gray" />
			<div className="h-[3.25rem]" />
			<div className="my-4 border-b border-gray" />
			<div className="grid gap-2">
				<Skeleton className="h-10 w-full rounded-full" />
				<Skeleton className="h-10 w-full rounded-full" />
			</div>
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div data-flush>
			<div className="h-[85svh] bg-lightgray md:h-screen" />
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

	return { product, reviews, restockNotificationsEnabled };
};

// The original's shipping note and FAQ ran on every product page from shared copy; these
// come from the store's own FAQ page so the two never disagree.
const PRODUCT_FAQS = faqCategories.flatMap((category) => category.questions).slice(0, 3);

const ProductDetails = async ({ params }: { params: Promise<{ slug: string }> }) => {
	const { slug } = await params;
	const { product, reviews, restockNotificationsEnabled } = await getProductPageData(slug);

	if (!product) {
		notFound();
	}

	const allImages = [
		...product.images,
		...product.variants.flatMap((v) => v.images).filter((img) => !product.images.includes(img)),
	];
	const theme = colorThemeFor(product.slug);
	const productJsonLd = await buildProductJsonLd(product, reviews);
	// Body sections leave room on the right for the sticky widget on wide screens.
	const beside = "w-full lg:w-[calc(100%-315px)]";

	return (
		<div data-flush>
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}

			<div className="relative w-full">
				<Suspense fallback={<div className="h-[85svh] bg-lightgray md:h-screen" />}>
					<MediaGallery images={allImages} productName={product.name} variants={product.variants} />
				</Suspense>

				{/* One widget: in the flow under the photograph on small screens, pinned to the
				    bottom-right of the viewport (sticky down the whole page) from lg up. */}
				<div className="mb-8 lg:pointer-events-none lg:absolute lg:top-0 lg:right-0 lg:z-10 lg:mb-0 lg:h-full lg:w-[315px]">
					<div className="lg:sticky lg:top-0 lg:h-screen">
						<div className="w-full lg:absolute lg:bottom-0 lg:p-4">
							{product.type === "bundle" && product.bundle?.groups?.length ? (
								<div className="pointer-events-auto rounded-md bg-white px-4 py-6 shadow-tile md:px-6">
									<h1 className="mb-4 text-ui-md font-bold uppercase">{product.name}</h1>
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
								<Suspense fallback={<WidgetSkeleton name={product.name} category={product.category?.name} />}>
									<AddToCartButton
										variants={product.variants}
										product={{
											id: product.id,
											name: product.name,
											slug: product.slug,
											images: product.images,
										}}
										category={product.category?.name}
										volumePricingTiers={product.volumePricingTiers}
										restockNotificationsEnabled={restockNotificationsEnabled}
									/>
								</Suspense>
							)}
						</div>
					</div>
				</div>

				{/* Statement in the page's ink, like the original's editorial callout. */}
				{product.summary && (
					<div className={cn(beside, "px-4 pt-4 md:px-8 lg:pt-8")} style={{ color: theme.text }}>
						<p className="max-w-[60rem] text-ui-2xl md:text-ui-4xl">{product.summary}</p>
						{product.category && (
							<Link
								href={`/category/${product.category.slug}`}
								className="mt-4 inline-flex h-10 items-center rounded-full px-4 text-ui-sm font-bold text-white duration-200 hover:opacity-80"
								style={{ background: theme.text }}
							>
								More {product.category.name}
							</Link>
						)}
					</div>
				)}

				<div className={cn(beside, "mt-8 mb-10 px-4 py-5 md:px-8")}>
					<div className="grid grid-cols-1 gap-10 md:grid-cols-2">
						<div className="space-y-10">
							{product.content && (
								<section>
									<h2 className="mb-4 text-ui-xl font-bold">Details</h2>
									<div className="prose max-w-none leading-paragraph text-offblack">
										<TiptapRenderer content={product.content} />
									</div>
								</section>
							)}
							<section>
								<h2 className="mb-4 text-ui-xl font-bold">Shipping &amp; Returns</h2>
								<p className="leading-paragraph">
									We ship every order with a tracked courier. If anything isn&apos;t right, you have 30 days
									to send it back unused for a full refund.{" "}
									<Link href="/faq" className="underline hover:no-underline">
										Read our full policy
									</Link>
									.
								</p>
							</section>
						</div>
						<section>
							<h2 className="mb-4 text-ui-xl font-bold">FAQ</h2>
							<Accordion type="single" collapsible className="border-t border-gray">
								{PRODUCT_FAQS.map((faq) => (
									<AccordionItem key={faq.question} value={faq.question} className="border-gray">
										<AccordionTrigger className="text-ui-md font-bold hover:no-underline">
											{faq.question}
										</AccordionTrigger>
										<AccordionContent className="text-ui-md leading-paragraph">{faq.answer}</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						</section>
					</div>
				</div>

				{reviews && (
					<div className={cn(beside, "px-4 md:px-8")}>
						<ProductReviews reviews={reviews} slug={slug} />
					</div>
				)}
			</div>

			<RelatedProducts
				productId={product.id}
				categorySlug={product.category?.slug}
				background={theme.background}
			/>
		</div>
	);
};
