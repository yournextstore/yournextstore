import Link from "next/link";
import { getCategoryTiles, getCollectionTiles, type ShowcaseTile } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

async function getMosaicTiles(): Promise<ShowcaseTile[]> {
	const collections = await getCollectionTiles(3);
	if (collections.length >= 3) return collections;
	// Fewer than three collections: top up with categories so the mosaic keeps its shape.
	const categories = await getCategoryTiles(3);
	return [...collections, ...categories].slice(0, 3);
}

/**
 * The original's three-up collection mosaic: two stacked tiles on the left, a tall one on the
 * right. From 900px the "Discover" pill and the description fade in on hover.
 */
export async function CollectionsMosaic() {
	const tiles = await getMosaicTiles();
	if (tiles.length < 3) return null;

	return (
		<section aria-label="Collections" className="shell section-y">
			<div className="grid h-[41.25rem] grid-rows-3 gap-2 sm:h-[27.5rem] sm:grid-cols-2 sm:grid-rows-2 large:h-[41.25rem]">
				{tiles.map((tile, index) => (
					<Link
						key={tile.id}
						href={tile.href}
						className={cn(
							"group relative block overflow-hidden bg-secondary",
							index === 2 && "sm:col-start-2 sm:row-span-2 sm:row-start-1",
						)}
					>
						{tile.image && (
							<YNSMedia
								src={tile.image}
								alt=""
								fill
								sizes="(min-width: 640px) 50vw, 100vw"
								className="object-cover"
							/>
						)}
						<span className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-transparent" />
						<span className="absolute inset-0 flex flex-col p-6 large:p-10">
							<span className="pill hidden self-end transition-opacity duration-500 sm:inline-flex large:opacity-0 large:group-hover:opacity-100">
								Discover
							</span>
							<span className="mt-auto text-heading-sm text-white large:text-heading-md">{tile.name}</span>
							{tile.description && (
								<span className="line-clamp-2 hidden text-lead text-white transition-all duration-500 sm:block large:h-0 large:opacity-0 large:group-hover:h-12 large:group-hover:opacity-100">
									{tile.description}
								</span>
							)}
						</span>
					</Link>
				))}
			</div>
		</section>
	);
}
