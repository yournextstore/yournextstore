import type { Metadata } from "next";
import { DisplayMedium, DisplaySmall } from "@/components/jam/display";
import { Hero } from "@/components/sections/hero";
import { getCategoryTiles, getHeroProduct, getTrending } from "@/lib/catalog";
import { PAGE, pluralize } from "@/lib/display";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

async function Shelves() {
	const tiles = (await getCategoryTiles()).slice(0, 2);
	if (tiles.length === 0) return null;
	return (
		<div className="my-4 grid grid-cols-1 gap-4 lg:my-8 lg:grid-cols-2">
			{tiles.map((tile) => (
				<DisplayMedium
					key={tile.href}
					href={tile.href}
					title={tile.title}
					subtitle={pluralize(tile.count, "item")}
					image={tile.image}
				/>
			))}
		</div>
	);
}

async function Trending() {
	const hero = await getHeroProduct();
	// The hero already shows the flagship piece; the row leads with other photographs.
	const products = await getTrending(4, hero?.id);
	if (products.length === 0) return null;
	return (
		<section aria-labelledby="trending-heading">
			<div className="flex flex-col items-center pt-10 pb-6 text-center">
				<h2 id="trending-heading" className="mb-3 text-4xl text-foreground">
					Trending Now
				</h2>
				<p className="text-sm text-muted-foreground">
					A few favourites from across the shop, picked for everyday life.
				</p>
			</div>
			<div className="my-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
				{products.map((product) => (
					<DisplaySmall
						key={product.id}
						href={`/product/${product.slug}`}
						title={product.name}
						subtitle={product.category?.name.toLowerCase() ?? ""}
						image={product.images[0] ?? null}
					/>
				))}
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<div className={PAGE}>
			<Hero />
			<Shelves />
			<Trending />
		</div>
	);
}
