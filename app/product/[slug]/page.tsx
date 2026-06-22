import { Star } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/app/product/[slug]/add-to-cart-button";
import { MediaGallery } from "@/app/product/[slug]/media-gallery";
import { ProductFeatures } from "@/app/product/[slug]/product-features";
import { ProductReviews } from "@/app/product/[slug]/product-reviews";
import { RelatedProducts } from "@/app/product/[slug]/related-products";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { YnsLink } from "@/components/yns-link";
import { commerce, meGetCached } from "@/lib/commerce";
import { DEMO_PRODUCTS, findDemoProductBySlug, isPreview, previewHref } from "@/lib/demo-products";
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
		if (!demo) {
			return { title: "Product Not Found", robots: { index: false, follow: false } };
		}
		return {
			title: demo.name,
			description: demo.summary ?? undefined,
			robots: { index: false, follow: false },
		};
	}

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

export default async function ProductPage(props: {
	params: Promise<{ slug: string }>;
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
	const sp = await props.searchParams;
	const preview = await isPreview(sp);
	const { slug } = await props.params;

	if (preview) {
		return <PreviewProductDetails slug={slug} />;
	}

	return <CachedProductDetails slug={slug} />;
}

async function CachedProductDetails({ slug }: { slug: string }) {
	"use cache";
	cacheLife("minutes");
	return <ProductDetails slug={slug} />;
}

function PreviewProductDetails({ slug }: { slug: string }) {
	const demo = findDemoProductBySlug(slug);
	if (!demo) {
		notFound();
	}
	const variants = demo.variants;
	const allImages = [
		...demo.images,
		...variants.flatMap((v) => v.images).filter((img) => !demo.images.includes(img)),
	];

	return (
		<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
			<div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6">
				<YnsLink href="/?preview=1" className="hover:text-foreground transition-colors">
					Home
				</YnsLink>
				<span className="mx-2">/</span>
				<YnsLink href="/products?preview=1" className="hover:text-foreground transition-colors">
					Shop
				</YnsLink>
				<span className="mx-2">/</span>
				<span className="text-foreground">{demo.name}</span>
			</div>
			<div className="lg:grid lg:grid-cols-2 lg:gap-16">
				<MediaGallery images={allImages} productName={demo.name} variants={variants} />
				<div className="mt-8 lg:mt-0 space-y-8">
					<div className="space-y-4">
						<p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
							{demo.category?.name ?? "The Edit"}
						</p>
						<h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-foreground tracking-tight">
							{demo.name}
						</h1>
						{demo.summary && <p className="text-muted-foreground leading-relaxed">{demo.summary}</p>}
					</div>
					<AddToCartButton
						variants={variants.map((v) => ({ ...v, omnibusPrice: null }))}
						product={{
							id: demo.id,
							name: demo.name,
							slug: demo.slug,
							images: demo.images,
						}}
						summary={demo.summary}
						volumePricingTiers={[]}
					/>
				</div>
			</div>
			<section className="mt-24 border-t border-border pt-12">
				<h2 className="font-display text-3xl font-light tracking-tight mb-8">You might also like</h2>
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14">
					{DEMO_PRODUCTS.filter((p) => p.id !== demo.id)
						.slice(0, 4)
						.map((p) => (
							<YnsLink key={p.id} href={previewHref(`/product/${p.slug}`, true)} className="group block">
								<div className="relative aspect-[3/4] gallery-frame overflow-hidden">
									<Image
										src={p.images[0] ?? "/scraped-0.jpg"}
										alt={p.name}
										fill
										sizes="(max-width: 1024px) 50vw, 25vw"
										className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
									/>
								</div>
								<div className="mt-3">
									<p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
										{p.category?.name ?? "Your Next Store"}
									</p>
									<p className="text-sm mt-1">{p.name}</p>
								</div>
							</YnsLink>
						))}
				</div>
			</section>
		</div>
	);
}

async function ProductDetails({ slug }: { slug: string }) {
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

	const productJsonLd = await buildProductJsonLd(product, reviews);

	return (
		<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			<div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6">
				<YnsLink href="/" className="hover:text-foreground transition-colors">
					Home
				</YnsLink>
				<span className="mx-2">/</span>
				<YnsLink href="/products" className="hover:text-foreground transition-colors">
					Shop
				</YnsLink>
				<span className="mx-2">/</span>
				<span className="text-foreground">{product.name}</span>
			</div>
			<div className="lg:grid lg:grid-cols-2 lg:gap-16">
				<MediaGallery images={allImages} productName={product.name} variants={product.variants} />

				<div className="mt-8 lg:mt-0 space-y-8">
					<div className="space-y-4">
						{product.category?.name && (
							<p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
								{product.category.name}
							</p>
						)}
						<h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-foreground tracking-tight text-balance">
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
			{reviews && <ProductReviews reviews={reviews} slug={slug} />}

			{/* Features Section (full width below) */}
			<ProductFeatures />
			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</div>
	);
}
