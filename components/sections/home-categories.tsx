import Link from "next/link";
import { Carousel } from "@/components/carousel";
import { getCategoryTiles } from "@/lib/catalog";
import { YNSMedia } from "@/lib/yns-media";

/**
 * "Shop by category": the original's square bordered tiles (product cut-out over white, name
 * below) that round into a circle on hover. Each tile is pictured by its category's first product.
 */
export async function HomeCategories() {
	const tiles = await getCategoryTiles(8);
	if (tiles.length === 0) return null;

	return (
		<section className="page-x w-full py-8">
			<h2 className="mb-6 text-heading font-medium uppercase md:text-title">Shop by category</h2>
			<Carousel
				label="Categories"
				itemClassName="w-[200px] sm:w-[233px]"
				desktopControls={tiles.length > 5}
				className="xl:[&>div:first-child]:justify-center"
			>
				{tiles.map((tile) => (
					<Link
						key={tile.href}
						href={tile.href}
						className="flex aspect-square flex-col items-center rounded-sm border border-border bg-background px-4 pb-3 pt-4 transition-[border-radius] duration-300 hover:rounded-full"
					>
						<div className="relative min-h-0 w-[78%] flex-1">
							{tile.image && (
								<YNSMedia src={tile.image} alt="" fill sizes="200px" className="object-contain" />
							)}
						</div>
						<span className="mt-2 w-full truncate text-center text-label-lg font-semibold">{tile.label}</span>
					</Link>
				))}
			</Carousel>
		</section>
	);
}
