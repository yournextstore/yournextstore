import Link from "next/link";
import { getCategoryTiles, getCollectionTiles } from "@/lib/catalog";
import { YNSMedia } from "@/lib/yns-media";

/**
 * The tinted "Categories" band: three tall portraits, the outer two lifted 3rem on desktop.
 * Filled with the store's categories, or its collections when it has none; a tile without a
 * picture of its own borrows one of its products' (tiles with no picture at all are skipped).
 */

export async function CategoryTiles() {
	const categories = await getCategoryTiles(3);
	const tiles = categories.length > 0 ? categories : await getCollectionTiles(3);
	if (tiles.length === 0) return null;

	return (
		<section className="bg-tint py-12 sm:py-24">
			<div className="container-wide">
				<h2 className="mb-12 text-center font-serif text-display-2 sm:mb-16">
					{categories.length > 0 ? "Categories" : "Collections"}
				</h2>
				<ul className="flex flex-col gap-y-4 md:flex-row md:justify-center md:gap-x-4">
					{tiles.map((tile, index) => (
						<li key={tile.id} className={`md:w-1/3 ${index % 2 === 0 ? "md:-mt-12" : ""}`}>
							<Link href={tile.href} className="mb-12 block">
								<div className="relative mb-6 aspect-[5/4] overflow-hidden bg-background md:aspect-[5/7]">
									{tile.image && (
										<YNSMedia
											src={tile.image}
											alt=""
											fill
											sizes="(max-width: 768px) 100vw, 33vw"
											className="object-cover"
										/>
									)}
								</div>
								<h3 className="mb-2 text-center text-heading">{tile.name}</h3>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
