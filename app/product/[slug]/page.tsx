import { Star } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/app/product/[slug]/add-to-cart-button";
import { MediaGallery } from "@/app/product/[slug]/media-gallery";
import { ProductFeatures } from "@/app/product/[slug]/product-features";
import { ProductReviews } from "@/app/product/[slug]/product-reviews";
import { RelatedProducts } from "@/app/product/[slug]/related-products";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { commerce, meGetCached } from "@/lib/commerce";
import { findDemoProductBySlug, isPreview } from "@/lib/demo-products";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { cn } from "@/lib/utils";

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

export async function generateMetadata({
	params,
	searchParams,
}: {
	params: Promise<{ slug: string }>;
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
	"use cache";
	cacheLife("minutes");
	const { slug } = await params;
	const sp = await searchParams;
	const preview = await isPreview(sp);

	if (preview) {
		const demo = findDemoProductBySlug(slug);
		return {
			title: demo ? `${demo.name} — Your Next Store` : "Preview — Your Next Store",
			description: demo?.summary ?? undefined,
			robots: { index: false, follow: false },
		};
	}

	const product = await commerce.productGet({ idOrSlug: slug });

	if (!product) {
		return { title: "Product Not Found — Your Next Store" };
	}

	return {
		title: `${product.name} — Your Next Store`,
		description: product.summary ?? undefined,
		openGraph: {
			title: product.name,
			description: product.summary ?? undefined,
			images: product.images[0] ? [product.images[0]] : undefined,
		},
	};
}

export default async function ProductPage(props: {
	params: Promise<{ slug: string }>;
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
	return <ProductDetails params={props.params} searchParams={props.searchParams} />;
}

const ProductDetails = async ({
	params,
	searchParams,
}: {
	params: Promise<{ slug: string }>;
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
	const { slug } = await params;
	const sp = await searchParams;
	const preview = await isPreview(sp);
	const me = await meGetCached().catch(() => null);
	const reviewsEnabled = me?.store.settings?.enabledTools?.reviews ?? false;

	const demoProduct = preview ? findDemoProductBySlug(slug) : undefined;

	const [product, reviews] = preview
		? [demoProduct, null]
		: await Promise.all([
				commerce.productGet({ idOrSlug: slug }),
				reviewsEnabled
					? commerce.productReviewsBrowse({ idOrSlug: slug }, { limit: 20 })
					: Promise.resolve(null),
			]);

	if (!product) {
		notFound();
	}

	const reviewSummary = reviews?.summary ?? null;

	const allImages = [
		...product.images,
		...product.variants.flatMap((v) => v.images).filter((img) => !product.images.includes(img)),
	];

	const productJsonLd =
		!preview && reviews
			? await buildProductJsonLd(product as Parameters<typeof buildProductJsonLd>[0], reviews)
			: null;

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			{!preview && (
				<>
					{productJsonLd && <JsonLdScript data={productJsonLd} />}
					<JsonLdScript
						data={buildProductBreadcrumbJsonLd(product as Parameters<typeof buildProductBreadcrumbJsonLd>[0])}
					/>
				</>
			)}
			<div className="lg:grid lg:grid-cols-2 lg:gap-16">
				<MediaGallery images={allImages} productName={product.name} variants={product.variants} />

				<div className="mt-8 lg:mt-0 space-y-8">
					{/* Title & reviews summary */}
					<div className="space-y-4">
						<span className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-medium text-[var(--violet-deep)]">
							Curated drop
						</span>
						<h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground text-balance">
							{product.name}
						</h1>
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

					{/* Short description, price, SKU, stock, variants, quantity, add to cart */}
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
					/>
				</div>
			</div>

			{/* Full description (below the fold, full width) */}
			{product.content && (
				<section className="mt-16 border-t border-border pt-12">
					<h2 className="mb-6 text-2xl font-medium tracking-tight">Product details</h2>
					<div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
						<TiptapRenderer content={product.content} />
					</div>
				</section>
			)}

			{/* Reviews Section */}
			{!preview && reviews && <ProductReviews reviews={reviews} slug={slug} />}

			<ProductFeatures />

			{!preview && <RelatedProducts productId={product.id} categorySlug={product.category?.slug} />}
		</div>
	);
};
