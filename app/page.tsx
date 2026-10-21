import type { Metadata } from "next";
import {
	Assurances,
	CategoryTiles,
	EditorialHero,
	FeaturedPieces,
	Lookbook,
	Ribbon,
} from "@/components/sections/home";
import { Newsletter } from "@/components/sections/newsletter";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Every section reads cached catalogue data, so the whole home page is part of the prerendered
// shell: no Suspense boundaries, nothing streams in after first paint.
export default function Home() {
	return (
		<>
			<EditorialHero />
			<Ribbon />
			<CategoryTiles />
			<FeaturedPieces />
			<Lookbook />
			<Assurances />
			<Newsletter />
		</>
	);
}
