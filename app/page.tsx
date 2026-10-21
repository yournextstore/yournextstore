import type { Metadata } from "next";
import { DropBand, GoodsShelf, HomeHero, ShopReport, StatsBand, StoryBand } from "@/components/sections/home";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Every section is a cached read rendered without its own Suspense boundary, so the whole
// page lands in the prerendered shell and nothing shifts in after first paint.
export default function Home() {
	return (
		<>
			<HomeHero />
			<ShopReport />
			<GoodsShelf />
			<StoryBand />
			<DropBand />
			<StatsBand />
		</>
	);
}
