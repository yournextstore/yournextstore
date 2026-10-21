import type { Metadata } from "next";
import {
	BestSeller,
	HelpBand,
	Hero,
	MissionMarquee,
	NewArrival,
	PromoGrid,
	ShopTheRange,
	StorySection,
	TrendingNow,
	Values,
} from "@/components/sections/home";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Every section reads cached catalog data only, so the whole page prerenders with the shell:
// no Suspense boundaries (a cached section behind one lands in a late segment and shifts layout).
export default function Home() {
	return (
		<>
			<Hero />
			<MissionMarquee />
			<TrendingNow />
			<StorySection />
			<Values />
			<NewArrival />
			<BestSeller />
			<PromoGrid />
			<ShopTheRange />
			<HelpBand />
		</>
	);
}
