import type { Metadata } from "next";
import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { CategoryGrid } from "@/components/sections/category-grid";
import { CollectionTiles } from "@/components/sections/collection-tiles";
import { Hero } from "@/components/sections/hero";
import { Lookbook } from "@/components/sections/lookbook";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { Sustainability } from "@/components/sections/sustainability";

function CollectionTilesSkeleton() {
	return (
		<section className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-24">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-x-3 gap-y-12">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={`tile-skel-${i}`} className="aspect-[3/4] bg-secondary yns-image-shimmer" />
				))}
			</div>
		</section>
	);
}

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<Suspense fallback={<CollectionTilesSkeleton />}>
				<CollectionTiles />
			</Suspense>
			<Sustainability />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="The wardrobe" eyebrow="— Capsule 003 —" limit={8} />
			<CategoryGrid />
			<Lookbook />
			<About />
			<Newsletter />
		</>
	);
}
