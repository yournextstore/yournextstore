import type { Metadata } from "next";
import { CategoryTiles, Colophon, Hero, Services, Shelves } from "@/components/sections/home";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// The sections are cached reads rendered without their own Suspense boundaries, so they land in
// the prerendered shell instead of streaming in after the first paint (no layout shift).
export default function Home() {
	return (
		<>
			<Hero />
			<CategoryTiles />
			<Shelves />
			<Services />
			<Colophon />
		</>
	);
}
