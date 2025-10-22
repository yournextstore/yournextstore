import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { formatMoney } from "@/money";
import { ynsClient } from "@/yns-client";
import { ProductCarousel } from "./product-carousel";

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
	cacheLife("seconds");

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
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
				{/* Left: Image Carousel */}
				<div>
					<ProductCarousel images={allImages} productName={product.name} />
				</div>

				{/* Right: Product Details */}
				<div className="space-y-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
						<p className="text-2xl font-semibold text-gray-900">{priceDisplay}</p>
					</div>

					{product.summary && (
						<div>
							<h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
								Description
							</h2>
							<p className="text-gray-700 leading-relaxed">{product.summary}</p>
						</div>
					)}

					<button
						type="button"
						className="w-full bg-black text-white py-4 px-8 rounded-full font-semibold hover:bg-gray-800 transition-colors"
					>
						Add to Cart
					</button>
				</div>
			</div>
		</div>
	);
};
