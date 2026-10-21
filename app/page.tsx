import type { Metadata } from "next";
import {
	CategoryBand,
	CollectionsBand,
	FeaturedCollectionBand,
	HomeHero,
	JournalBand,
	NewPieces,
} from "@/components/sections/home";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Every section is a cached read rendered without its own Suspense boundary, so the whole page
// lands in the prerendered shell and nothing shifts as it streams.
export default function Home() {
	return (
		<>
			<HomeHero />
			<FeaturedCollectionBand />
			<NewPieces />
			<CategoryBand />
			<CollectionsBand />
			<JournalBand />
		</>
	);
}
