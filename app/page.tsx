import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Banner } from "@/components/sections/banner";
import { CollectionsMosaic } from "@/components/sections/collections-mosaic";
import { GetInspired } from "@/components/sections/get-inspired";
import { Hero } from "@/components/sections/hero";
import { ProductCarousel } from "@/components/sections/product-carousel";
import { getPicturedFirstProducts } from "@/lib/catalog";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

async function getBestsellers() {
	"use cache";
	cacheLife("minutes");
	return getPicturedFirstProducts(9);
}

// Every section reads cached data only, so the whole page renders without Suspense
// boundaries: nothing streams in after the first paint to shift the layout.
export default async function Home() {
	const bestsellers = await getBestsellers();

	return (
		<>
			<Hero />
			<CollectionsMosaic />
			<ProductCarousel
				title="Our bestsellers"
				products={bestsellers}
				footer={
					<Link href="/products" className="pill mx-auto [--pill-px:1.25rem]">
						View all
					</Link>
				}
			/>
			<Banner />
			<GetInspired />
		</>
	);
}
