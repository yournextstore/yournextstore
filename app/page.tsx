import type { Metadata } from "next";
import { Suspense } from "react";
import { FlavorFeature } from "@/components/sections/flavor-feature";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { OurStory } from "@/components/sections/our-story";
import { ProductGrid } from "@/components/sections/product-grid";
import { WhatsPopular } from "@/components/sections/whats-popular";

function PopularSkeleton() {
	return (
		<section className="px-3 sm:px-6 py-16 sm:py-24">
			<div className="max-w-7xl mx-auto grid grid-cols-12 gap-8 items-center">
				<div className="col-span-12 md:col-span-6 space-y-4">
					<div className="h-16 w-3/4 bg-[var(--peach-light)] rounded animate-pulse" />
					<div className="h-5 w-1/2 bg-[var(--peach-light)] rounded animate-pulse" />
				</div>
				<div className="col-span-12 md:col-span-6 flex justify-end gap-8">
					<div className="w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-[var(--sky-soft)] animate-pulse" />
					<div className="w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-[var(--peach-light)] animate-pulse" />
				</div>
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
			<Suspense fallback={<PopularSkeleton />}>
				<WhatsPopular />
			</Suspense>
			<OurStory />
			<FlavorFeature />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="The Full Lineup" description="Every flavor we make, all in one place." limit={6} />
			<Newsletter />
		</>
	);
}
