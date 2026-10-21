import type { Metadata } from "next";
import { ShowcaseTile } from "@/components/deckle";
import { getCollectionTiles, getStoreBrand, pieces } from "@/lib/catalog";

export async function generateMetadata(): Promise<Metadata> {
	const brand = await getStoreBrand();
	return {
		title: "Collections",
		description: `Every collection in the ${brand.name} shop.`,
		alternates: { canonical: "/collections" },
	};
}

/** The collections, three across, each on its own small stage. */
export default async function CollectionsPage() {
	const tiles = await getCollectionTiles();

	return (
		<section aria-labelledby="collections-title" className="band">
			<div className="grid justify-items-start gap-6">
				<h1 id="collections-title" className="max-w-[20ch] text-title-1 text-balance">
					Collections
				</h1>
				<p className="max-w-[52ch] text-lg text-muted-foreground">
					Pieces put together to sit side by side:{" "}
					{tiles.length === 1 ? "one collection" : `${tiles.length} collections`}, each with everything that
					belongs in it.
				</p>
			</div>
			<p className="mt-12 mb-6 border-t border-border pt-6 font-semibold">
				{tiles.length === 1 ? "1 collection" : `${tiles.length} collections`}
			</p>
			<ul className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3 lg:gap-6">
				{tiles.map((tile, index) => (
					<li key={tile.id}>
						<ShowcaseTile
							href={tile.href}
							image={tile.image}
							title={tile.name}
							meta={pieces(tile.count)}
							sizes="(max-width: 1024px) 50vw, 33vw"
							priority={index < 2}
						/>
					</li>
				))}
			</ul>
		</section>
	);
}
