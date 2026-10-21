import type { Metadata } from "next";
import { CategoryCircles, CollectionGrid, FeatureCards, Hero, LessIsMore } from "@/components/sections/home";
import { ProductGrid } from "@/components/sections/product-grid";
import { EDITORIAL, getCategoryTiles, getCollectionTiles, getStoreIdentity } from "@/lib/catalog";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default async function Home() {
	const [identity, categories, collections] = await Promise.all([
		getStoreIdentity(),
		getCategoryTiles(),
		getCollectionTiles(),
	]);
	// The first collection with products, or the whole shop when there is none.
	const feature = collections[0] ?? null;

	return (
		<>
			<Hero image={EDITORIAL.hero} eyebrow={identity.name} />
			<div className="shell grid items-center gap-8 pt-6 pb-8 md:py-8">
				<CategoryCircles tiles={categories.length > 0 ? categories : collections} />
				<ProductGrid
					title="Featured Products"
					description="A few favourites from the shop, picked to help you find something you will love."
					limit={4}
					showViewAll
				/>
				<CollectionGrid feature={feature} image={EDITORIAL.feature} side={EDITORIAL.side} />
				<FeatureCards />
			</div>
			<LessIsMore image={EDITORIAL.less} />
		</>
	);
}
