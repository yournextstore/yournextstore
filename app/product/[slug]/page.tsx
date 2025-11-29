import { notFound } from "next/navigation";
import { Suspense } from "react";
import { formatMoney } from "../../../src/money";
import { ynsClient } from "../../../src/yns-client";
import { AddToCartButton } from "./add-to-cart-button";
import { ImageGallery } from "./image-gallery";
import { ProductFeatures } from "./product-features";

const currency = "USD";
const locale = "en-US";

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
	return (
		<Suspense>
			<ProductDetails params={props.params} />
		</Suspense>
	);
}

const ProductDetails = async ({ params }: { params: Promise<{ slug: string }> }) => {
	"use cache";
	const { slug } = await params;
	const product = await ynsClient.productGet({ idOrSlug: slug });

	if (!product) {
		notFound();
	}

	const prices = product.variants.map((v) => BigInt(v.price));
	const minPrice = prices.length > 0 ? prices.reduce((a, b) => (a < b ? a : b)) : BigInt(0);
	const maxPrice = prices.length > 0 ? prices.reduce((a, b) => (a > b ? a : b)) : BigInt(0);

	const priceDisplay =
		prices.length > 1 && minPrice !== maxPrice
			? `${formatMoney({ amount: minPrice, currency, locale })} - ${formatMoney({ amount: maxPrice, currency, locale })}`
			: formatMoney({ amount: minPrice, currency, locale });

	const allImages = [
		...product.images,
		...product.variants.flatMap((v) => v.images).filter((img) => !product.images.includes(img)),
	];

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="lg:grid lg:grid-cols-2 lg:gap-16">
				{/* Left: Image Gallery (sticky on desktop) */}
				<ImageGallery images={allImages} productName={product.name} />

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
					/>
				</div>
			</div>

			{/* Features Section (full width below) */}
			<ProductFeatures />
		</div>
	);
};
