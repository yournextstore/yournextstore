import { Plus } from "lucide-react";
import Link from "next/link";
import { QuickAddButton } from "@/components/quick-add-button";
import { type CardProduct, getCardInfo } from "@/lib/card-info";
import { YNSMedia } from "@/lib/yns-media";

/**
 * Eyesome's "Trending Products" tile: a soft grey rounded card with the name top-left, the price
 * and an amber "+" top-right, the category under it and the product photo below.
 */
export async function TrendingCard({
	product,
	priority = false,
}: {
	product: CardProduct;
	priority?: boolean;
}) {
	const { price, quickAdd, category, image } = await getCardInfo(product);
	const plus = "plus-gradient inline-flex h-5 w-5 items-center justify-center rounded-md text-white";

	return (
		<div className="group relative flex flex-col gap-3 rounded-xl bg-black/[0.06] px-4 py-2 transition-colors hover:bg-black/[0.08]">
			<div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-center sm:flex-nowrap sm:justify-between sm:text-left">
				<p className="pt-1 text-xl font-bold leading-tight xs:text-base sm:text-xl">
					<Link href={`/product/${product.slug}`} className="after:absolute after:inset-0 after:rounded-xl">
						{product.name}
					</Link>
				</p>
				<div className="flex flex-col items-center sm:items-end">
					<div className="flex items-center">
						<span className="pt-1 text-lg font-bold xs:text-base sm:text-lg">{price}</span>
						{quickAdd ? (
							<QuickAddButton
								variantId={quickAdd.id}
								variantSku={"sku" in quickAdd ? quickAdd.sku : null}
								variantPrice={quickAdd.price}
								variantPriceGross={"priceGross" in quickAdd ? quickAdd.priceGross : null}
								variantImages={quickAdd.images}
								product={{
									id: product.id,
									name: product.name,
									slug: product.slug,
									images: product.images ?? [],
								}}
								label={`Add ${product.name} to bag`}
								className={`relative z-10 ms-2 ${plus} transition-transform hover:scale-110`}
							>
								<Plus className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
							</QuickAddButton>
						) : (
							<span aria-hidden className={`ms-2 ${plus}`}>
								<Plus className="h-3.5 w-3.5" strokeWidth={3} />
							</span>
						)}
					</div>
					{category && <p className="text-sm text-muted-foreground">{category}</p>}
				</div>
			</div>
			<div className="relative mx-auto mb-2 aspect-[16/9] w-36 overflow-hidden xs:w-32 sm:w-40">
				{image && (
					<YNSMedia
						src={image}
						alt=""
						fill
						sizes="160px"
						priority={priority}
						className="blend-shot object-cover transition-transform duration-300 group-hover:scale-110"
					/>
				)}
			</div>
		</div>
	);
}
