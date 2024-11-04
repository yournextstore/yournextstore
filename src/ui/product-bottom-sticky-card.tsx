import { MainProductImage } from "@/ui/products/main-product-image";
import type * as Commerce from "commerce-kit";
import { formatMoney } from "commerce-kit/currencies";
import Image from "next/image";
import { AddToCartButton } from "./add-to-cart-button";

export const ProductBottomStickyCard = ({
	product,
	locale,
}: { product: Commerce.MappedProduct; locale: string }) => {
	return (
		<div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t py-4 shadow-lg transition-all duration-300 ease-in-out transform translate-y-0 z-10">
			<div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto flex justify-between items-center">
				<div className="flex items-center gap-x-4">
					<div>
						{product.images[0] && (
							<MainProductImage
								className="w-16 h-16 rounded-lg bg-neutral-100 object-cover object-center"
								src={product.images[0]}
								loading="eager"
								priority
								alt=""
							/>
						)}
					</div>
					<div>
						<h3 className="font-semibold text-lg">{product.name}</h3>

						{product.default_price.unit_amount && (
							<p className="text-sm">
								{formatMoney({
									amount: product.default_price.unit_amount,
									currency: product.default_price.currency,
									locale,
								})}
							</p>
						)}
					</div>
				</div>

				<AddToCartButton productId={product.id} disabled={product.metadata.stock <= 0} />
			</div>
		</div>
	);
};
