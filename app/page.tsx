import type { Metadata } from "next";
import { CategoryTiles } from "@/components/sections/category-tiles";
import { Hero } from "@/components/sections/hero";
import { LifestyleBand } from "@/components/sections/lifestyle-band";
import { MiniEdit } from "@/components/sections/mini-edit";
import { Newsletter } from "@/components/sections/newsletter";
import { PrintAndPattern } from "@/components/sections/print-pattern";
import { ProductGrid } from "@/components/sections/product-grid";
import { ShopByEdit } from "@/components/sections/shop-by-edit";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<CategoryTiles />
			<ShopByEdit />
			<PrintAndPattern />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid
				title="Best Sellers"
				eyebrow="Loved By You"
				description="Tried, tested and twirled in — the pieces our customers reach for again and again."
				limit={8}
				columns={4}
			/>
			<LifestyleBand />
			<MiniEdit />
			<Newsletter />
		</>
	);
}
