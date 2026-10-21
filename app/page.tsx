import type { Metadata } from "next";
import { BestSellers } from "@/components/sections/best-sellers";
import { Closing } from "@/components/sections/closing";
import { Families } from "@/components/sections/families";
import { Hero } from "@/components/sections/hero";
import { Story } from "@/components/sections/story";
import { getCategoryTiles, getCategoryTones, getHomeProducts } from "@/lib/catalog";
import { meGetCached } from "@/lib/commerce";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Every read is cached, so the whole page prerenders into the shell with no Suspense boundary
// to shift the layout when it resolves.
export default async function Home() {
	const [me, tiles, tones, { featured, bestSellers }] = await Promise.all([
		meGetCached().catch(() => null),
		getCategoryTiles(4),
		getCategoryTones(),
		getHomeProducts(),
	]);
	const categories = tiles.map((tile) => ({ ...tile, tone: tones[tile.id] ?? 0 }));

	return (
		<>
			<Hero storeName={me?.store.name || "Your Next Store"} featured={featured} categories={categories} />
			<Story description={me?.store.settings?.storeDescription || ""} />
			<Families tiles={categories} />
			<BestSellers products={bestSellers} />
			<Closing />
		</>
	);
}
