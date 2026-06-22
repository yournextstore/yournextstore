import type { Metadata } from "next";
import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { CollectionsStrip } from "@/components/sections/collections-strip";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

function CollectionsStripSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={`tile-${i}`} className="aspect-[3/4] bg-secondary rounded-3xl animate-pulse" />
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
			<Suspense fallback={<CollectionsStripSkeleton />}>
				<CollectionsStrip />
			</Suspense>
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="The collection" limit={6} />
			<About />
			<Newsletter />
		</>
	);
}
