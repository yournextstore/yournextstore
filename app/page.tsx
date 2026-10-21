import type { Metadata } from "next";
import {
	CategoryBand,
	CategoryBento,
	HomeHero,
	HomeProductRows,
	HomeTestimonials,
} from "@/components/sections/home";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Every section reads cached catalogue data, so the whole page prerenders: no Suspense
// boundaries, which would stream the sections in after the footer and shift it (CLS).
export default function Home() {
	return (
		<>
			<HomeHero />
			<CategoryBand />
			<div className="my-[50px] sm:my-[72px]">
				<HomeProductRows />
				<CategoryBento />
				<HomeTestimonials />
			</div>
		</>
	);
}
