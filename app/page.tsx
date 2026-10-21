import type { Metadata } from "next";
import { CollectionCards } from "@/components/sections/collection-cards";
import { ProductGrid } from "@/components/sections/product-grid";
import { getStoreBasics } from "@/lib/store-basics";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// The original's home is the catalogue itself: a three-up grid of cards straight under the
// header. Shop sections follow in the same card language. Both sections are cached, so the
// page prerenders whole (no Suspense, no layout shift).
export default async function Home() {
	const { storeName } = await getStoreBasics();
	return (
		<>
			<h1 className="sr-only">{storeName}</h1>
			<ProductGrid title="Products" hideTitle limit={9} />
			<CollectionCards />
		</>
	);
}
