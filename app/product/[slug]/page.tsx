import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/app/product/[slug]/add-to-cart-button";
import { MediaGallery } from "@/app/product/[slug]/media-gallery";
import { ProductFeatures } from "@/app/product/[slug]/product-features";
import { ProductReviews } from "@/app/product/[slug]/product-reviews";
import { RelatedProducts } from "@/app/product/[slug]/related-products";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { formatMoney } from "@/lib/money";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	const { slug } = await params;
	const product = await commerce.productGet({ idOrSlug: slug });

	if (!product) {
		return { title: "Product Not Found — Vela" };
	}

	return {
		title: `${product.name} — Vela`,
		description: product.summary ?? undefined,
		openGraph: {
			title: product.name,
			description: product.summary ?? undefined,
			images: product.images[0] ? [product.images[0]] : undefined,
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
	const [product, reviews] = await Promise.all([
		commerce.productGet({ idOrSlug: slug }),
		commerce.productReviewsBrowse({ idOrSlug: slug }, { limit: 20 }),
	]);

	if (!product) {
		notFound();
	}

	const { minPrice, maxPrice } = product.variants.reduce(
		(acc, v) => {
			const price = BigInt(v.price);
			return {
				minPrice: price < acc.minPrice ? price : acc.minPrice,
				maxPrice: price > acc.maxPrice ? price : acc.maxPrice,
			};
		},
		{
			minPrice: product.variants[0] ? BigInt(product.variants[0].price) : BigInt(0),
			maxPrice: product.variants[0] ? BigInt(product.variants[0].price) : BigInt(0),
		},
	);

	const priceDisplay =
		product.variants.length > 1 && minPrice !== maxPrice
			? `${formatMoney({ amount: minPrice, currency: CURRENCY, locale: LOCALE })} - ${formatMoney({ amount: maxPrice, currency: CURRENCY, locale: LOCALE })}`
			: formatMoney({ amount: minPrice, currency: CURRENCY, locale: LOCALE });

	const allImages = [
		...product.images,
		...product.variants.flatMap((v) => v.images).filter((img) => !product.images.includes(img)),
	];

	return (
		<main className="section-shell-tight">
			<JsonLdScript data={buildProductJsonLd(product, reviews)} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			<article className="grid gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(20rem,0.88fr)] lg:gap-14">
				<MediaGallery images={allImages} productName={product.name} variants={product.variants} />

				<div className="surface-panel mt-2 h-fit p-6 sm:p-8 lg:sticky lg:top-28">
					<div className="space-y-6">
						<div className="space-y-4">
							<div className="flex flex-wrap items-center gap-x-4 gap-y-2">
								{product.category?.slug ? (
									<YnsLink
										prefetch={"eager"}
										href={`/collection/${product.category.slug}`}
										className="editorial-kicker transition-colors hover:text-foreground"
									>
										{product.category.name ?? "Collection"}
									</YnsLink>
								) : (
									<p className="editorial-kicker">Selected piece</p>
								)}
								{product.variants.length > 1 ? (
									<span className="text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">
										{product.variants.length} finish options
									</span>
								) : null}
							</div>
							<h1 className="font-editorial text-[clamp(2.4rem,4vw,4.2rem)] leading-[0.95] tracking-[-0.05em] text-balance text-foreground">
								{product.name}
							</h1>
							<p className="font-editorial text-2xl tracking-[-0.03em] text-foreground sm:text-[2rem]">
								{priceDisplay}
							</p>
							{product.summary && (
								<p className="max-w-xl border-t border-border/80 pt-5 text-sm leading-7 text-muted-foreground sm:text-base">
									{product.summary}
								</p>
							)}
						</div>

						<div className="border-t border-border/80 pt-6">
							<AddToCartButton
								variants={product.variants}
								product={{
									id: product.id,
									name: product.name,
									slug: product.slug,
									images: product.images,
								}}
								volumePricingTiers={product.volumePricingTiers}
							/>
						</div>
					</div>
				</div>
			</article>

			<ProductReviews reviews={reviews} slug={slug} />
			<ProductFeatures />
			<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
		</main>
	);
};
