import type { Metadata } from "next";
import { FeaturedProducts, Hero, NewArrivals, OfferBand } from "@/components/sections/home-sections";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Every section reads the one cached catalog browse, so they render straight into the
// prerendered page without Suspense boundaries that would stream in and shift the layout.
export default function Home() {
	return (
		<>
			<Hero />
			<NewArrivals />
			<FeaturedProducts />
			<OfferBand />
		</>
	);
}
