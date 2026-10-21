import type { Metadata } from "next";
import { Benefits } from "@/components/sections/benefits";
import { Hero } from "@/components/sections/hero";
import { ProductGrid } from "@/components/sections/product-grid";
import { Ritual } from "@/components/sections/ritual";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Cached sections render without their own Suspense: a boundary would stream them in after the
// first flush and shift everything below.
export default function Home() {
	return (
		<>
			<Hero />
			<ProductGrid title="Newest Arrivals" kicker="Fresh Picks" limit={4} />
			<Ritual />
			<Benefits />
		</>
	);
}
