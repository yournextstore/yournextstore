import type { Metadata } from "next";
import {
	FaqAccordions,
	FeatureHero,
	getHomeData,
	HalfHero,
	HeroBanner,
	ImageTiles,
	ProductsSliderSection,
	PromiseBand,
	RecommendedProducts,
	Statement,
	TilesPair,
} from "@/components/sections/home";
import { editorial } from "@/lib/editorial";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Every read below is cached, so the whole page (sections included) prerenders with the shell
// and nothing streams in under the hero: no section boundaries, no layout shift.
export default async function Home() {
	const { categories, identity } = await getHomeData();
	const statement =
		identity.storeDescription ??
		`${identity.storeName} makes everyday outdoor clothes you will reach for on the trail and in town.`;

	return (
		<>
			<HeroBanner storeName={identity.storeName} />
			<ProductsSliderSection title="Shop the New Arrivals" />
			<HalfHero
				image={editorial.wear}
				superheading="Layer up"
				heading="One Kit, Every Kind of Day"
				body="Start with a merino tee, add a grid fleece for the cool start and keep a shell in the pack. Every layer works on its own and with the others."
				cta="Shop layers"
				href="/products"
			/>
			<FeatureHero frames={editorial.feature} />
			<PromiseBand />
			<RecommendedProducts />
			<Statement text={statement} categories={categories} />
			<HalfHero
				image={editorial.newProducts}
				heading="All New Products"
				body="Browse the full range in one place, from merino tees to rain shells, and find what your next day outside needs."
				cta="Explore collection"
				href="/products"
				reverse
			/>
			<ImageTiles categories={categories} />
			<TilesPair />
			<FaqAccordions />
		</>
	);
}
