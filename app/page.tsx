import type { Metadata } from "next";
import { Caring, Hero, Promises, Shelf, Statement } from "@/components/sections/home-sections";
import { ProductGrid } from "@/components/sections/product-grid";
import { EDITORIAL, getHomeData } from "@/lib/catalog";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Every read here is cached, so the whole page prerenders: no Suspense boundary to stream in late.
export default async function Home() {
	const { products, shelf } = await getHomeData();

	return (
		<>
			<Hero image={EDITORIAL.hero} />
			<Shelf cards={shelf} />
			<Statement />
			<ProductGrid products={products} className="py-10 lg:py-[4.5rem]" />
			<Caring image={EDITORIAL.caring} />
			<Promises />
		</>
	);
}
