import Link from "next/link";
import { type CardProduct, getCardDetails, PriceLine } from "@/components/product-card";
import { YNSMedia } from "@/lib/yns-media";

/** The white card that sits on hero photographs: name, category, price. */
export async function ProductTile({ product }: { product: CardProduct }) {
	const details = await getCardDetails(product);
	return (
		<Link
			href={`/product/${product.slug}`}
			className="group block min-w-[12.5em] max-w-[18rem] rounded-md bg-white p-5 text-offblack transition-[border-radius] duration-500 ease-out hover:rounded-xl"
		>
			{details.soldOut && <div className="mb-2 text-ui-xs font-bold uppercase text-darkgray">Sold out</div>}
			{details.compareAt && !details.soldOut && (
				<div className="mb-2 text-ui-xs font-bold uppercase text-sale">Sale</div>
			)}
			<div className="truncate text-ui-lg font-bold group-hover:underline">{product.name}</div>
			{details.category && <div className="mt-1 truncate text-ui-sm text-darkgray">{details.category}</div>}
			{details.options && <div className="mt-1 truncate text-ui-sm text-darkgray">{details.options}</div>}
			<div className="mt-2 text-ui-sm">
				<PriceLine price={details.price} compareAt={details.compareAt} />
			</div>
		</Link>
	);
}

/** A product photograph filling a rounded well, with its tile in the bottom-right corner. */
export async function ProductHero({
	product,
	priority = false,
	className = "aspect-[1300/768]",
}: {
	product: CardProduct;
	priority?: boolean;
	className?: string;
}) {
	const { image } = await getCardDetails(product);
	return (
		<div className={`relative w-full overflow-hidden rounded-md bg-lightgray ${className}`}>
			{image && (
				<YNSMedia
					src={image}
					alt={product.name}
					fill
					sizes="100vw"
					priority={priority}
					className="object-cover"
				/>
			)}
			<div className="absolute right-4 bottom-4 hidden sm:block">
				<ProductTile product={product} />
			</div>
		</div>
	);
}
