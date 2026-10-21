import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { getHomeData } from "@/components/sections/home-data";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Every section reads one cached loader, so the whole page prerenders with the shell
// (no Suspense boundary to stream in later and shift the layout).
export default async function Home() {
	const { storeName, products } = await getHomeData();

	return (
		<div className="shell">
			<Hero storeName={storeName} />
			<ProductGrid storeName={storeName} products={products} />
			<Newsletter />
		</div>
	);
}
