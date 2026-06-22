import type { Metadata } from "next";
import { About, PromoCard } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { ProductGrid } from "@/components/sections/product-grid";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main>
			<Hero />
			<PromoCard />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid />
			<About />
		</main>
	);
}
