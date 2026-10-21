import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { QuickAddButton } from "@/components/quick-add-button";
import { type CardProduct, getCardInfo } from "@/lib/card-info";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

/**
 * Eyesome's listing card: white glass card with a grey photo well on top, the name with the amber
 * price (and the struck list price) beside it, a grey meta line, then a hairline and the outline
 * "Add to Bag" pill. On small phones it lies on its side, photo left, as the original did.
 */
export async function ProductCard({
	product,
	priority = false,
	headingLevel = "h2",
}: {
	product: CardProduct;
	priority?: boolean;
	headingLevel?: "h2" | "h3";
}) {
	const { price, compareAt, quickAdd, meta, image } = await getCardInfo(product);
	const Heading = headingLevel;
	const href = `/product/${product.slug}`;

	return (
		<div className="group relative flex flex-col overflow-hidden rounded-lg border-2 border-black/[0.05] bg-white/50 shadow-md transition-[transform,box-shadow] hover:scale-[1.02] hover:shadow-lg xs:max-sm:flex-row">
			<div className="relative aspect-[4/3] w-full shrink-0 bg-well xs:max-sm:aspect-auto xs:max-sm:w-[45%]">
				{image && (
					<YNSMedia
						src={image}
						alt=""
						fill
						priority={priority}
						sizes="(max-width: 640px) 45vw, (max-width: 1280px) 33vw, 25vw"
						className="object-cover"
					/>
				)}
			</div>
			<div className="flex min-w-0 flex-1 flex-col justify-between gap-2 p-3 pt-4">
				<div>
					<div className="flex justify-between gap-2">
						<Heading className="min-w-0 text-xl font-medium leading-tight">
							<Link href={href} className="after:absolute after:inset-0">
								{product.name}
							</Link>
						</Heading>
						<div className="flex shrink-0 flex-col items-end">
							<span className="text-price">{price}</span>
							{compareAt && <span className="text-sm text-muted-foreground line-through">{compareAt}</span>}
						</div>
					</div>
					{meta && <p className="mt-1 text-sm text-muted-foreground">{meta}</p>}
				</div>
				<div className="flex items-center justify-between border-t pt-2">
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
							label={`Add to Bag, ${product.name}`}
							className="btn-rounded-secondary relative z-10 whitespace-nowrap px-4 text-sm hover:shadow-md sm:px-6"
						>
							Add to Bag
						</QuickAddButton>
					) : (
						<span
							className={cn("btn-rounded-secondary text-sm group-hover:bg-foreground group-hover:text-white")}
						>
							Choose options
						</span>
					)}
					<ShoppingBag className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} aria-hidden />
				</div>
			</div>
		</div>
	);
}
