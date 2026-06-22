import type { Metadata } from "next";
import { CollectionRow } from "@/components/sections/collection-row";
import { CraftStrip } from "@/components/sections/craft-strip";
import { EditorialSplit } from "@/components/sections/editorial-split";
import { FounderNote } from "@/components/sections/founder-note";
import { FragranceFamilyGrid } from "@/components/sections/fragrance-family-grid";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { PressMarquee } from "@/components/sections/press-marquee";
import { ProductGrid } from "@/components/sections/product-grid";

// The home page carries its own canonical: the layout no longer sets one, so pages that do not set
// theirs would otherwise inherit nothing (see app/layout.tsx).
export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order.
// A boundary around cached data still ships its skeleton first and the content later in the HTML.
export default function Home() {
	return (
		<>
			<Hero />
			<CollectionRow />
			<EditorialSplit />
			<CraftStrip />
			<ProductGrid
				title="The current collection"
				eyebrow="New Arrivals"
				description="Édition Hiver — eight new fragrances released in numbered batches of 250 each."
				limit={6}
			/>
			<PressMarquee />
			<FragranceFamilyGrid />
			<FounderNote />
			<Newsletter />
		</>
	);
}
