import type { Metadata } from "next";
import {
	BestSellers,
	CategoryShowcase,
	ClosingCta,
	FeaturedGrid,
	HomeHero,
	Marquee,
	Philosophy,
} from "@/components/sections/home";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Every section reads cached catalogue data, so the whole page prerenders without Suspense
// boundaries (a boundary around cached content still streams late and shifts the layout).
export default function Home() {
	return (
		<>
			<HomeHero />
			<Marquee />
			<BestSellers />
			<CategoryShowcase />
			<FeaturedGrid />
			<Philosophy />
			<ClosingCta />
		</>
	);
}
