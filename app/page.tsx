import type { Metadata } from "next";
import { CollectionStory, HeroBanner, SaleEdit, TrustSignals } from "@/components/sections/home";
import { ProductGrid } from "@/components/sections/product-grid";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Every section is a cached read rendered without its own Suspense boundary, so the whole
// page lands in the prerendered shell and nothing shifts in after the first paint.
export default function Home() {
	return (
		<>
			<HeroBanner />
			<ProductGrid />
			<CollectionStory />
			<SaleEdit />
			<TrustSignals />
		</>
	);
}
