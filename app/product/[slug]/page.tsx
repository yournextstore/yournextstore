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
		<div className="bg-[#FAFAF8]">
			{/* Top border */}
			<div className="h-px w-full bg-zinc-200" />

			<div className="max-w-7xl mx-auto px-8 lg:px-16 py-16 lg:py-24">
				<div className="lg:grid lg:grid-cols-12 lg:gap-16">
					{/* Left: Image Gallery */}
					<div className="lg:col-span-7">
						<ImageGallery images={allImages} productName={product.name} variants={product.variants} />
					</div>

					{/* Right: Product Details */}
					<div className="lg:col-span-5 mt-12 lg:mt-0">
						<div className="lg:sticky lg:top-32">
							{/* Product metadata */}
							<p className="text-xs tracking-[0.3em] uppercase text-zinc-400 mb-6">
								Product Details
							</p>

							{/* Title */}
							<h1 className="text-3xl lg:text-4xl font-light tracking-[-0.02em] text-zinc-900 leading-tight">
								{product.name}
							</h1>

							{/* Price */}
							<p className="mt-6 text-lg text-zinc-900 font-light">{priceDisplay}</p>

							{/* Description */}
							{product.summary && (
								<p className="mt-8 text-sm text-zinc-500 leading-relaxed font-light">
									{product.summary}
								</p>
							)}

							{/* Divider */}
							<div className="mt-10 mb-10 h-px w-full bg-zinc-200" />

							{/* Variant Selector, Quantity, Add to Cart */}
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
				</div>

				{/* Features Section */}
				<ProductFeatures />
			</div>
		</div>
	);
};
