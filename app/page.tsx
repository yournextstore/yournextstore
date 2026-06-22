import type { Metadata } from "next";
import { Suspense } from "react";
import { CategoryTiles } from "@/components/sections/category-tiles";
import { Hero } from "@/components/sections/hero";
import { Lookbook } from "@/components/sections/lookbook";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Featured drop" limit={6} />
			<Lookbook />
			<Suspense>
				<CategoryTiles />
			</Suspense>
			<Newsletter />
		</>
	);
}
