import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { HomeCategories } from "@/components/sections/home-categories";
import { HomeCollection } from "@/components/sections/home-collection";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Every section reads the one cached catalogue browse, so the whole page prerenders:
// no Suspense boundaries, nothing streams in after the first paint.
export default function Home() {
	return (
		<>
			<Hero />
			<HomeCollection />
			<HomeCategories />
		</>
	);
}
