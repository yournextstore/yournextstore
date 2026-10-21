import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { type CollectionTile, getCollectionTiles } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

export function CollectionCard({ tile, priority = false }: { tile: CollectionTile; priority?: boolean }) {
	return (
		<Link href={tile.href} className="group block">
			<div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-secondary">
				<YNSMedia
					src={tile.image}
					alt=""
					fill
					priority={priority}
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					className="object-cover object-[50%_70%] transition-[scale] duration-500 group-hover:scale-[1.03]"
				/>
			</div>
			<p className="mt-3 inline-flex items-center gap-1.5 px-3 text-body sm:mt-4 sm:px-6">
				{tile.name}
				<ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
			</p>
		</Link>
	);
}

/** Three across, or two when the count splits evenly that way, so the last row is never one tile. */
export function tileGridClass(count: number) {
	return count % 3 !== 0 && count % 2 === 0 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
}

/** Fluid's collection-list section: image cards, each a name with an arrow. */
export async function CollectionList({ title, className }: { title?: string; className?: string }) {
	const tiles = await getCollectionTiles(6);
	if (tiles.length === 0) {
		return null;
	}

	return (
		<section className={cn("container pb-16 sm:pb-24", className)}>
			{title && <h2 className="mb-5 text-section sm:mb-6 sm:text-[2.34rem]">{title}</h2>}
			<div className={cn("grid grid-cols-1 gap-x-5 gap-y-8", tileGridClass(tiles.length))}>
				{tiles.map((tile) => (
					<CollectionCard key={tile.id} tile={tile} />
				))}
			</div>
		</section>
	);
}
