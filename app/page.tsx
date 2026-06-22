import type { Metadata } from "next";
import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { CollectionStrip } from "@/components/sections/collection-strip";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

function HeroSkeleton() {
	return (
		<section className="hero-backdrop">
			<div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-24 min-h-[60vh]" />
		</section>
	);
}

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main>
			<Suspense fallback={<HeroSkeleton />}>
				<Hero />
			</Suspense>
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="The Collection" limit={6} />
			<Suspense>
				<CollectionStrip />
			</Suspense>
			<About />
			<Newsletter />
		</main>
	);
}
