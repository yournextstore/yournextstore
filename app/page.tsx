import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { ProductGrid } from "@/components/sections/product-grid";
import { Promotions } from "@/components/sections/promotions";
import { getHomeProducts } from "@/lib/catalog";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default async function Home() {
	const { arrivals } = await getHomeProducts();

	return (
		<>
			<Hero />
			<Promotions />
			<ProductGrid products={arrivals} />
		</>
	);
}
