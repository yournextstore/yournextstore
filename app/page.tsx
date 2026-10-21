import type { Metadata } from "next";
import {
	BakeryHero,
	FeaturedDelights,
	FromTheCounter,
	MenuAtAGlance,
	MenuFinder,
	PastryPortraits,
	WelcomeBand,
} from "@/components/sections/bakery-home";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Every section is cached, so the whole page prerenders: no Suspense boundaries, no late shifts.
export default function Home() {
	return (
		<>
			<BakeryHero />
			<FeaturedDelights />
			<WelcomeBand />
			<PastryPortraits />
			<MenuAtAGlance />
			<FromTheCounter />
			<MenuFinder />
		</>
	);
}
