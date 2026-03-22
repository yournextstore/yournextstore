import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AddToCartButton } from "@/app/[locale]/product/[slug]/add-to-cart-button";
import { MediaGallery } from "@/app/[locale]/product/[slug]/media-gallery";
import { ProductFeatures } from "@/app/[locale]/product/[slug]/product-features";
import { ProductReviews } from "@/app/[locale]/product/[slug]/product-reviews";
import { RelatedProducts } from "@/app/[locale]/product/[slug]/related-products";
import { getCommerce } from "@/lib/commerce";
import { getActiveCurrency, getCurrencyForLocale } from "@/lib/currency";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { formatMoney } from "@/lib/money";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
	const { slug, locale } = await params;
	const currency = getCurrencyForLocale(locale);
	const api = getCommerce({ lang: locale, currency });
	const [product, t] = await Promise.all([api.productGet({ idOrSlug: slug }), getTranslations("Metadata")]);

	if (!product) {
		return { title: t("productNotFound") };
	}

	return {
		title: t("productTitle", { name: product.name }),
		description: product.summary ?? undefined,
		openGraph: {
			title: product.name,
			description: product.summary ?? undefined,
			images: product.images[0] ? [product.images[0]] : undefined,
		},
	};
}

export default async function ProductPage(props: { params: Promise<{ slug: string; locale: string }> }) {
	const { locale } = await props.params;
	const currency = await getActiveCurrency(locale);
	return <ProductDetails params={props.params} locale={locale} currency={currency} />;
}

const ProductDetails = async ({
	params,
	locale,
	currency,
}: {
	params: Promise<{ slug: string }>;
	locale: string;
	currency: string;
}) => {
	const { slug } = await params;
	const api = getCommerce({ lang: locale, currency });
	const [product, reviews] = await Promise.all([
		api.productGet({ idOrSlug: slug }),
		api.productReviewsBrowse({ idOrSlug: slug }, { limit: 20 }),
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
			? `${formatMoney({ amount: minPrice, currency, locale })} - ${formatMoney({ amount: maxPrice, currency, locale })}`
			: formatMoney({ amount: minPrice, currency, locale });

	const allImages = [
		...product.images,
		...product.variants.flatMap((v) => v.images).filter((img) => !product.images.includes(img)),
	];

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<JsonLdScript data={buildProductJsonLd(product, reviews, currency)} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			<div className="lg:grid lg:grid-cols-2 lg:gap-16">
				{/* Left: Image Gallery (sticky on desktop) */}
				<MediaGallery images={allImages} productName={product.name} variants={product.variants} />

				{/* Right: Product Details */}
				<div className="mt-8 lg:mt-0 space-y-8">
					{/* Title, Price, Description */}
					<div className="space-y-4">
						<h1 className="text-4xl font-medium tracking-tight text-foreground lg:text-5xl text-balance">
							{product.name}
						</h1>
						<p className="text-2xl font-semibold tracking-tight">{priceDisplay}</p>
						{product.summary && <p className="text-muted-foreground leading-relaxed">{product.summary}</p>}
					</div>

					{/* Variant Selector, Quantity, Add to Cart, Trust Badges */}
					<AddToCartButton
						variants={product.variants}
						product={{
							id: product.id,
							name: product.name,
							slug: product.slug,
							images: product.images,
						}}
						volumePricingTiers={product.volumePricingTiers}
						priceDisplay={priceDisplay}
					/>
				</div>
			</div>

			{/* Reviews Section */}
			<ProductReviews reviews={reviews} slug={slug} locale={locale} />

			{/* Features Section (full width below) */}
			<ProductFeatures locale={locale} />

			{/* Related Products */}
			<RelatedProducts
				productId={product.id}
				categorySlug={product.category?.slug}
				locale={locale}
				currency={currency}
			/>
		</div>
	);
};
