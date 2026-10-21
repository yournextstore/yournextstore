import type { Metadata } from "next";
import { CollectionCard, tileGridClass } from "@/components/sections/collection-list";
import { getCollectionTiles } from "@/lib/catalog";

export const metadata: Metadata = {
	title: "Collections",
	alternates: { canonical: "/collections" },
};

export default async function CollectionsPage() {
	const tiles = await getCollectionTiles(24);

	return (
		<div className="container min-h-[60svh] pb-20 pt-12 sm:pb-28 sm:pt-20">
			<h1 className="mb-8 text-title sm:mb-10 sm:text-[3.125rem]">Collections</h1>
			{tiles.length === 0 ? (
				<p className="text-body text-muted-foreground">No collections yet.</p>
			) : (
				<div className={`grid grid-cols-1 gap-x-5 gap-y-8 ${tileGridClass(tiles.length)}`}>
					{tiles.map((tile, index) => (
						<CollectionCard key={tile.id} tile={tile} priority={index < 3} />
					))}
				</div>
			)}
		</div>
	);
}
