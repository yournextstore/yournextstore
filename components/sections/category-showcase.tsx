import Link from "next/link";
import { ArrowCircle } from "@/components/isle";
import { getCategoryTiles } from "@/lib/catalog";
import { YNSMedia } from "@/lib/yns-media";

/**
 * The original's Journal card, a screen tall: the store's categories as small square photos
 * with their names beside them, and "All Products" at the bottom.
 */
export async function CategoryShowcase() {
	const tiles = await getCategoryTiles(6);
	if (tiles.length === 0) return null;

	return (
		<section
			className="card mx-1 mt-1 flex min-h-[calc(100svh-8px)] flex-col gap-12 bg-paper"
			aria-labelledby="categories-title"
		>
			<h2 id="categories-title" className="text-title">
				Categories
			</h2>
			<ul className="grid-site my-auto gap-y-3">
				{tiles.map((tile) => (
					<li key={tile.id} className="col-span-2 lg:col-span-4">
						<Link href={tile.href} className="group grid grid-cols-2 gap-3">
							<span className="relative aspect-square overflow-hidden rounded-sm bg-white">
								{tile.image && (
									<YNSMedia
										src={tile.image}
										alt=""
										fill
										sizes="(width >= 64rem) 16vw, 45vw"
										className="object-cover"
									/>
								)}
							</span>
							<span className="leading-[1.2] group-hover:underline">{tile.name}</span>
						</Link>
					</li>
				))}
			</ul>
			<Link href="/products" className="flex items-center justify-between text-title hover:underline">
				All Products
				<ArrowCircle />
			</Link>
		</section>
	);
}
