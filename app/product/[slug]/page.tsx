import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/app/product/[slug]/add-to-cart-button";
import { ImageGallery } from "@/app/product/[slug]/image-gallery";
import { ProductFeatures } from "@/app/product/[slug]/product-features";
import { commerce } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
	"use cache";
	cacheLife("minutes");

	return <ProductDetails params={props.params} />;
}

const ProductDetails = async ({ params }: { params: Promise<{ slug: string }> }) => {
	const { slug } = await params;
	const product = await commerce.productGet({ idOrSlug: slug });

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
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="lg:grid lg:grid-cols-2 lg:gap-16">
				{/* Left: Image Gallery (sticky on desktop) */}
				<ImageGallery images={allImages} productName={product.name} variants={product.variants} />

				{/* Right: Product Details */}
				<div className="mt-8 lg:mt-0 space-y-8">
					{/* Title, Price, Description */}
					<div className="space-y-4">
						<h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground lg:text-5xl text-balance">
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
					/>
				</div>
			</div>

			{/* Features Section (full width below) */}
			<ProductFeatures />
		</div>
	);
};
