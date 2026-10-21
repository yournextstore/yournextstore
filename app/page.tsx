import type { Metadata } from "next";
import { BrowseCategories, PromoBanner, SearchBar } from "@/components/sections/home";
import { ProductGrid } from "@/components/sections/product-grid";
import { getStoreSeo } from "@/lib/commerce";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default async function Home() {
	const { storeName } = await getStoreSeo();
	return (
		<>
			<h1 className="sr-only">{storeName}</h1>
			<div className="mt-[22px]">
				<SearchBar />
			</div>
			<PromoBanner />
			<BrowseCategories />
			<ProductGrid title="Popular now" limit={8} priorityCount={2} />
		</>
	);
}
