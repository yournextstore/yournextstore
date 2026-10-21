import type { Metadata } from "next";
import { HomeCallToAction, HomeCollections, HomeFeatured, HomeHero } from "@/components/home/sections";
import { getStoreSeo } from "@/lib/commerce";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default async function Home() {
	const { storeName } = await getStoreSeo();
	return (
		<>
			<h1 className="sr-only">{storeName}</h1>
			<HomeHero />
			<HomeCollections />
			<HomeFeatured />
			<HomeCallToAction />
		</>
	);
}
