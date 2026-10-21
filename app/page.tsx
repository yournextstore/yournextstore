import type { Metadata } from "next";
import { BestOf } from "@/components/sections/home/best-of";
import { EveryRoutine } from "@/components/sections/home/every-routine";
import { Hero } from "@/components/sections/home/hero";
import { NameMarquee } from "@/components/sections/home/name-marquee";
import { PromoBand } from "@/components/sections/home/promo-band";
import { ShopByCollection } from "@/components/sections/home/shop-by-collection";
import { WhyChoose } from "@/components/sections/home/why-choose";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Every section reads cached catalogue data only, so the whole home page prerenders (no Suspense, CLS 0).
export default function Home() {
	return (
		<>
			<Hero />
			<WhyChoose />
			<EveryRoutine />
			<NameMarquee />
			<BestOf />
			<PromoBand />
			<ShopByCollection />
		</>
	);
}
