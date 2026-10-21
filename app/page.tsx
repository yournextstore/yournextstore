import type { Metadata } from "next";
import { CategoryTiles, FeaturedProducts, HomeHero, NewArrivals } from "@/components/sections/home";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Every section reads cached data only, so the whole lobby prerenders: no Suspense, no layout shift.
export default function Home() {
	return (
		<div className="mx-auto grid w-full grid-cols-1 max-w-6xl items-center px-4 pt-6 pb-8 sm:px-8 lg:py-6">
			<HomeHero />
			<CategoryTiles />
			<FeaturedProducts />
			<NewArrivals />
		</div>
	);
}
