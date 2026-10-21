import type { Metadata } from "next";
import {
	DailyBestSells,
	FeaturedCategories,
	FeatureRow,
	HomeHero,
	PopularProducts,
	PromoBanners,
} from "@/components/sections/home";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Every section reads one cached snapshot of the catalogue, so the whole page prerenders
// without Suspense boundaries (nothing streams in after the first paint, CLS 0).
export default function Home() {
	return (
		<>
			<HomeHero />
			<FeaturedCategories />
			<PromoBanners />
			<PopularProducts />
			<DailyBestSells />
			<FeatureRow />
		</>
	);
}
