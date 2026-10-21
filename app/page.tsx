import type { Metadata } from "next";
import { CollectionsSection } from "@/components/sections/collections";
import { Hero } from "@/components/sections/hero";
import { MenuSection } from "@/components/sections/menu";
import { Quote } from "@/components/sections/quote";
import { SpecialDish } from "@/components/sections/special-dish";
import { Specialties } from "@/components/sections/specialties";
import { Story } from "@/components/sections/story";
import { Strengths } from "@/components/sections/strengths";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Every section reads cached data only, so the whole page prerenders: no Suspense boundary to
// stream in late and shift what is already painted.
export default function Home() {
	return (
		<>
			<Hero />
			<Specialties />
			<Story />
			<SpecialDish />
			<MenuSection />
			<Quote />
			<Strengths />
			<CollectionsSection />
		</>
	);
}
