import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import {
	CollectionsShelf,
	Colophon,
	EverythingGrid,
	Lookbook,
	Quote,
	ThemeBar,
	Values,
} from "@/components/sections/home";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Every section reads cached data only, so the whole page prerenders without a boundary
// (a Suspense around a cached section still streams it after the first flush: CLS).
export default function Home() {
	return (
		<>
			<Hero />
			<ThemeBar />
			<CollectionsShelf />
			<EverythingGrid />
			<Values />
			<Lookbook />
			<Quote />
			<Colophon />
		</>
	);
}
