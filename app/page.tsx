import type { Metadata } from "next";
import { FeaturedPieces, Hero, Rooms, SoloPiece, SpecBand } from "@/components/sections/home";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Every section is a cached read rendered without its own Suspense boundary, so the whole
// page lands in the prerendered shell and nothing shifts in after the first paint.
export default function Home() {
	return (
		<>
			<Hero />
			<SpecBand />
			<FeaturedPieces />
			<SoloPiece />
			<Rooms />
		</>
	);
}
