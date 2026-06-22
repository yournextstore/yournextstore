import type { Metadata } from "next";
import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { CategoryBar } from "@/components/sections/category-bar";
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
			<Suspense fallback={<div className="h-20" />}>
				<CategoryBar />
			</Suspense>
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Newest Pieces" variant="newest" limit={6} />
			<Lookbook />
			<About />
			<Newsletter />
		</>
	);
}
