import type { APIProductsBrowseResult } from "commerce-kit";
import { cacheLife } from "next/cache";
import Image from "next/image";
import { MaterialIcon } from "@/components/icons/material-icon";
import { ProductBadge } from "@/components/product/product-badge";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";

export type Product = APIProductsBrowseResult["data"][number];

type NewArrivalsProps = {
	limit?: number;
};

export async function NewArrivals({ limit = 3 }: NewArrivalsProps) {
	"use cache";
	cacheLife("minutes");

	const products = (await commerce.productBrowse({ active: true, limit, offset: 4 })).data;

	return (
		<section className="py-20 bg-dark-accent border-y border-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="flex justify-between items-end mb-12">
					<div>
						<span className="text-primary font-semibold text-sm tracking-wider uppercase">
							Fresh In Stock
						</span>
						<h2 className="text-3xl md:text-4xl font-bold mt-2 text-white">New Arrivals</h2>
					</div>
					<YnsLink
						href="/"
						className="hidden md:flex items-center text-white hover:text-primary transition-colors font-medium"
					>
						View All Products
						<MaterialIcon name="arrow_forward" className="ml-2" />
					</YnsLink>
				</div>

				{/* Product Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{products.map((product) => {
						const variants = product.variants;
						const firstVariantPrice = variants?.[0] ? BigInt(variants[0].price) : null;
						const priceDisplay = firstVariantPrice
							? formatMoney({ amount: firstVariantPrice, currency: CURRENCY, locale: LOCALE })
							: null;

						const allImages = [
							...(product.images ?? []),
							...(variants
								?.flatMap((v) => v.images ?? [])
								.filter((img) => !(product.images ?? []).includes(img)) ?? []),
						];
						const primaryImage = allImages[0];

						// Truncate description
						const productDesc = "description" in product ? (product.description as string | null) : null;
						const description = productDesc
							? productDesc.length > 100
								? `${productDesc.substring(0, 100)}...`
								: productDesc
							: "Experience the natural benefits of our premium CBD products.";

						return (
							<div
								key={product.id}
								className="bg-background-dark rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-colors group"
							>
								<YnsLink prefetch={"eager"} href={`/product/${product.slug}`}>
									<div className="relative h-64 product-card-bg flex items-center justify-center p-6">
										<div className="absolute top-4 right-4">
											<ProductBadge variant="new" />
										</div>
										{primaryImage ? (
											<Image
												src={primaryImage}
												alt={product.name}
												fill
												sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
												className="object-cover group-hover:scale-105 transition-transform duration-500"
											/>
										) : (
											<MaterialIcon name="spa" className="text-primary text-7xl" />
										)}
									</div>
								</YnsLink>
								<div className="p-6">
									<YnsLink prefetch={"eager"} href={`/product/${product.slug}`}>
										<h3 className="text-xl font-bold text-white mb-2 hover:text-primary transition-colors">
											{product.name}
										</h3>
									</YnsLink>
									<p className="text-gray-400 text-sm mb-4 line-clamp-2">{description}</p>
									<div className="flex justify-between items-center">
										<span className="text-lg font-bold text-primary">{priceDisplay}</span>
										<button
											type="button"
											className="text-white hover:text-primary p-2 border border-border rounded-full hover:border-primary transition-colors"
										>
											<MaterialIcon name="add_shopping_cart" />
										</button>
									</div>
								</div>
							</div>
						);
					})}
				</div>

				{/* Mobile View All Link */}
				<div className="mt-8 text-center md:hidden">
					<YnsLink
						href="/"
						className="inline-flex items-center text-white hover:text-primary transition-colors font-medium"
					>
						View All Products
						<MaterialIcon name="arrow_forward" className="ml-2" />
					</YnsLink>
				</div>
			</div>
		</section>
	);
}
