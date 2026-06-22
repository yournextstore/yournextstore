import { ChevronRight, Gift, Heart, Star } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/app/product/[slug]/add-to-cart-button";
import { MediaGallery } from "@/app/product/[slug]/media-gallery";
import { ProductFeatures } from "@/app/product/[slug]/product-features";
import { ProductReviews } from "@/app/product/[slug]/product-reviews";
import { RelatedProducts } from "@/app/product/[slug]/related-products";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { YnsLink } from "@/components/yns-link";
import { commerce, meGetCached } from "@/lib/commerce";
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	"use cache";
	cacheLife("minutes");
	const { slug } = await params;
	const product = await commerce.productGet({ idOrSlug: slug });

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

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
	"use cache";
	cacheLife("minutes");

	return <ProductDetails params={props.params} />;
}

const ProductDetails = async ({ params }: { params: Promise<{ slug: string }> }) => {
	const { slug } = await params;
	const me = await meGetCached().catch(() => null);
	const reviewsEnabled = me?.store.settings?.enabledTools?.reviews ?? false;
	const [product, reviews] = await Promise.all([
		commerce.productGet({ idOrSlug: slug }),
		reviewsEnabled ? commerce.productReviewsBrowse({ idOrSlug: slug }, { limit: 20 }) : Promise.resolve(null),
	]);

	if (!product) {
		notFound();
	}

	const reviewSummary = reviews?.summary ?? null;

	const allImages = [
		...product.images,
		...product.variants.flatMap((v) => v.images).filter((img) => !product.images.includes(img)),
	];

	const words = product.name.split(" ");
	const brandLabel = (words.length > 1 ? words[0] : "YNS Atelier").toUpperCase();

	const productJsonLd = await buildProductJsonLd(product, reviews);

	return (
		<div className="mx-auto max-w-[1440px] px-6 py-8 lg:px-12">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />

			<nav className="mb-6 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
				<YnsLink href="/" className="hover:text-foreground transition-colors">
					Home
				</YnsLink>
				<ChevronRight className="h-3 w-3" strokeWidth={1.5} />
				<YnsLink href="/products" className="hover:text-foreground transition-colors">
					Clothing
				</YnsLink>
				{product.category && (
					<>
						<ChevronRight className="h-3 w-3" strokeWidth={1.5} />
						<YnsLink
							href={`/collection/${product.category.slug}`}
							className="hover:text-foreground transition-colors"
						>
							{product.category.name}
						</YnsLink>
					</>
				)}
				<ChevronRight className="h-3 w-3" strokeWidth={1.5} />
				<span className="text-foreground line-clamp-1">{product.name}</span>
			</nav>

			<div className="lg:grid lg:grid-cols-[1.2fr_1fr] lg:gap-16">
				<MediaGallery images={allImages} productName={product.name} variants={product.variants} />

				<div className="mt-8 space-y-6 lg:mt-0 lg:sticky lg:top-32 lg:self-start">
					<div className="space-y-3">
						<p className="text-[11px] uppercase tracking-[0.28em] text-lilac-deep">{brandLabel}</p>
						<h1 className="font-display text-3xl font-medium leading-tight tracking-[-0.01em] text-foreground lg:text-4xl">
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
						<button
							type="button"
							className="ml-auto inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground transition-colors"
						>
							<Heart className="h-4 w-4" strokeWidth={1.5} />
							Save
						</button>
					</div>

					{product.summary && (
						<p className="text-sm leading-relaxed text-muted-foreground">{product.summary}</p>
					)}

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

					<div className="flex items-start gap-3 border-y border-border bg-lilac-soft/50 p-4">
						<div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
							<Gift className="h-4 w-4" strokeWidth={1.5} />
						</div>
						<div>
							<p className="text-[11px] uppercase tracking-[0.22em] text-foreground">Welcome reward</p>
							<p className="mt-1 text-sm text-muted-foreground">
								Sign up to YNS members and enjoy <span className="text-foreground">15% off</span> your first
								order.
							</p>
						</div>
					</div>
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
			{reviews && <ProductReviews reviews={reviews} slug={slug} />}

			<ProductFeatures />

			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</div>
	);
};
