import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { CategoryGrid } from "@/components/sections/category-grid";
import { Hero } from "@/components/sections/hero";
import { FeatureList, HelpCallout, HomeFaq } from "@/components/sections/home-content";
import { ProductMarquee } from "@/components/sections/product-grid";
import { commerce } from "@/lib/commerce";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

async function getBestSellers() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({ active: true, limit: 24 });
	// Pictured, priced products first: the marquee should never open on an empty frame or a zero price.
	const lead = (p: (typeof data)[number]) =>
		p.images.length > 0 && p.variants.some((v) => BigInt(v.price) > 0n);
	return [...data.filter(lead), ...data.filter((p) => !lead(p))].slice(0, 12);
}

// Every section is cached and rendered without its own Suspense boundary, so the whole
// page lands in the prerendered shell (no streamed segment shifting the layout).
export default async function Home() {
	const bestSellers = await getBestSellers();

	return (
		<>
			<Hero />
			<CategoryGrid />
			<FeatureList />
			<HelpCallout />
			<ProductMarquee title="Featured products" products={bestSellers} />
			<HomeFaq />
		</>
	);
}
