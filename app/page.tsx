import type { Metadata } from "next";
import { BestSellers } from "@/components/sections/best-sellers";
import { CuratedEssentials } from "@/components/sections/curated-essentials";
import { Hero } from "@/components/sections/hero";
import { NewArrivals } from "@/components/sections/new-arrivals";
import { Philosophy } from "@/components/sections/philosophy";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<CuratedEssentials limit={3} />
			<BestSellers limit={4} />
			<NewArrivals limit={4} />
			<Philosophy />
		</>
	);
}
