import type { Metadata } from "next";
import { AboutSection } from "@/components/sections/about-section";
import { BrandsStrip } from "@/components/sections/brands-strip";
import { Hero } from "@/components/sections/hero";
import { ProductGrid } from "@/components/sections/product-grid";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main>
			<Hero />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Featured Products" limit={8} />

			{/* 3. Brands/Partners strip */}
			<BrandsStrip />

			{/* 4. About section with store description */}
			<AboutSection />
		</main>
	);
}
