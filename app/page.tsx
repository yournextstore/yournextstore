import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { CategoryChips } from "@/components/sections/category-chips";
import { EditorialBreak } from "@/components/sections/editorial-break";
import { FeaturedCollection } from "@/components/sections/featured-collection";
import { Hero } from "@/components/sections/hero";
import { MaterialCraft } from "@/components/sections/material-craft";
import { Newsletter } from "@/components/sections/newsletter";
import { PressLogos } from "@/components/sections/press-logos";
import { ProductGrid } from "@/components/sections/product-grid";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Reads no `searchParams`: the home page prerenders in full. The theme's `?preview=1` demo mode needed the query and
// the request headers, which would take the whole page out of the prerendered shell.
export default function Home() {
	return (
		<>
			<Hero />
			<CategoryChips />
			<FeaturedCollection />
			<EditorialBreak />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. */}
			<ProductGrid
				eyebrow="Shelf favorites"
				title="Best sellers"
				description="What our regulars keep returning for, season after season."
				limit={8}
				columns={4}
			/>
			<MaterialCraft />
			<PressLogos />
			<About />
			<Newsletter />
		</>
	);
}
