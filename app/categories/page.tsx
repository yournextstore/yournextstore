import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { PageBar } from "@/components/gf/page-bar";
import { CategoryCard } from "@/components/sections/home";
import { getCatalog, getCategoryTiles, hasMembers } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
import { YNSMedia } from "@/lib/yns-media";

export const metadata: Metadata = {
	title: "Categories",
	alternates: { canonical: "/categories" },
};

async function getCollections() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.collectionBrowse({ limit: 20 });
	return data.filter(hasMembers);
}

/** Every category with its product count (the original's /categories), then the collections. */
export default async function CategoriesPage() {
	const [tiles, collections, catalog] = await Promise.all([
		getCategoryTiles(),
		getCollections(),
		getCatalog(),
	]);
	// A collection without its own picture borrows a catalogue photo, so no tile is blank.
	const pictured = catalog.filter((product) => product.images.length > 0);

	return (
		<div>
			<PageBar title="Categories" />
			{tiles.length === 0 ? (
				<p className="py-16 text-center text-gf-h5 text-muted-foreground">No categories yet.</p>
			) : (
				<div className="mt-[22px] flex flex-wrap justify-center">
					{tiles.map((tile) => (
						<CategoryCard key={tile.id} tile={tile} showCount />
					))}
				</div>
			)}

			{collections.length > 0 && (
				<section className="mt-[30px]">
					<h2 className="text-gf-h4 font-bold">Collections</h2>
					<ul className="mt-[18px] grid grid-cols-2 gap-3 sm:grid-cols-3">
						{collections.map((collection, index) => {
							const fallback = pictured[(index * 5) % Math.max(1, pictured.length)]?.images[0];
							const image = collection.image ?? fallback;
							return (
								<li key={collection.id}>
									<Link
										href={`/collection/${collection.slug}`}
										className="flex h-full flex-col gap-2.5 rounded-[30px] bg-white p-2.5 gf-shadow transition-shadow hover:outline hover:outline-green-500"
									>
										<span className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-flash-white">
											{image && (
												<YNSMedia
													src={image}
													alt=""
													fill
													sizes="(max-width: 640px) 45vw, 190px"
													className={collection.image ? "object-cover" : "gf-photo object-cover"}
												/>
											)}
										</span>
										<span className="px-1 pb-1 text-gf-h5 font-bold">{collection.name}</span>
									</Link>
								</li>
							);
						})}
					</ul>
				</section>
			)}
		</div>
	);
}
