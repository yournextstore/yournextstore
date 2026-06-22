import { Star } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/app/product/[slug]/add-to-cart-button";
import { MediaGallery } from "@/app/product/[slug]/media-gallery";
import { ProductFeatures } from "@/app/product/[slug]/product-features";
import { ProductReviews } from "@/app/product/[slug]/product-reviews";
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
import { commerce, meGetCached } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { DEMO_PRODUCTS, getDemoProduct, isPreview } from "@/lib/demo-products";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { formatMoney } from "@/lib/money";
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

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({
	params,
	searchParams,
}: {
	params: Params;
	searchParams: SearchParams;
}): Promise<Metadata> {
	const { slug } = await params;
	const sp = await searchParams;
	const preview = await isPreview(sp);

	if (preview) {
		const demo = getDemoProduct(slug);
		return {
			title: `${demo?.name ?? "Preview"} — Your Next Store`,
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

export default async function ProductPage(props: { params: Params; searchParams: SearchParams }) {
	const sp = await props.searchParams;
	const preview = await isPreview(sp);
	const { slug } = await props.params;

	if (preview) {
		return <PreviewProductDetails slug={slug} />;
	}

	return <ProductDetails slug={slug} />;
}

async function PreviewProductDetails({ slug }: { slug: string }) {
	const demo = getDemoProduct(slug) ?? DEMO_PRODUCTS[0];
	if (!demo) {
		notFound();
	}
	const variant = demo.variants[0];
	const priceDisplay = variant
		? formatMoney({ amount: BigInt(variant.price), currency: CURRENCY, locale: LOCALE })
		: "";
	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
			<div className="lg:grid lg:grid-cols-2 lg:gap-16">
				<MediaGallery images={demo.images} productName={demo.name} variants={demo.variants} />
				<div className="mt-8 lg:mt-0 space-y-8">
					<div className="space-y-4">
						<p className="text-[11px] uppercase tracking-[0.32em] text-clay/80">
							{demo.category?.name ?? "Atelier"}
						</p>
						<h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-walnut text-balance">
							{demo.name}
						</h1>
						<p className="font-serif text-2xl text-clay">{priceDisplay}</p>
						{demo.summary && <p className="text-base text-espresso/70 leading-relaxed">{demo.summary}</p>}
					</div>
					<AddToCartButton
						variants={demo.variants.map((v) => ({
							id: v.id,
							price: v.price,
							originalPrice: v.originalPrice,
							sku: v.sku,
							images: v.images,
							stock: v.stock,
							omnibusPrice: null,
							combinations: [],
						}))}
						product={{ id: demo.id, name: demo.name, slug: demo.slug, images: demo.images }}
						volumePricingTiers={[]}
					/>
				</div>
			</div>
			<ProductFeatures />
		</div>
	);
}

const ProductDetails = async ({ slug }: { slug: string }) => {
	"use cache";
	cacheLife("minutes");

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
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			<Breadcrumb className="mb-6">
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
			<div className="lg:grid lg:grid-cols-2 lg:gap-16">
				<MediaGallery images={allImages} productName={product.name} variants={product.variants} />

				<div className="mt-8 lg:mt-0 space-y-8">
					{/* Title & reviews summary */}
					<div className="space-y-4">
						{product.category?.name && (
							<p className="text-[11px] uppercase tracking-[0.32em] text-clay/80">{product.category.name}</p>
						)}
						<h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-walnut text-balance">
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
};
