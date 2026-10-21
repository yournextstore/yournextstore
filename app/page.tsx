import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Hero } from "@/components/sections/hero";
import {
	BenefitsSection,
	ChoosingSection,
	CommunityGridSection,
	CommunitySection,
	ProductRailSection,
	StepsSection,
} from "@/components/sections/home-sections";
import { meGetCached } from "@/lib/commerce";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

async function getStoreName() {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	return me?.store.name || "Your Next Store";
}

// Every section reads cached data only, so they render without Suspense boundaries: a cached
// section inside one still lands after the first flush and shifts the page as it streams in.
export default async function Home() {
	const storeName = await getStoreName();

	return (
		<>
			<Hero storeName={storeName} />
			<CommunitySection />
			<BenefitsSection />
			<ProductRailSection />
			<StepsSection />
			<ChoosingSection storeName={storeName} />
			<CommunityGridSection storeName={storeName} />
		</>
	);
}
