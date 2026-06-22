import type { Metadata } from "next";
import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { CollectionGrid } from "@/components/sections/collection-grid";
import { FeelingStripe } from "@/components/sections/feeling-stripe";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { PressWall } from "@/components/sections/press-wall";
import { ProductGrid } from "@/components/sections/product-grid";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<FeelingStripe />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid
				title="Best Sellers"
				description="Six shades. Eight hours of wear. Zero compromises."
				limit={6}
			/>
			<Suspense>
				<CollectionGrid />
			</Suspense>
			<About />
			<PressWall />
			<Newsletter />
		</>
	);
}
