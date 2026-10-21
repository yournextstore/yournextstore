import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { Bestsellers, CategoryStrip, PerfectPiece } from "@/components/sections/mandala-home";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Every section reads cached catalogue data only, so the whole page prerenders (no Suspense, no shift).
export default function Home() {
	return (
		<>
			<Hero />
			<PerfectPiece />
			<CategoryStrip />
			<Bestsellers />
		</>
	);
}
