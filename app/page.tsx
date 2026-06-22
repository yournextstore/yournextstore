import type { Metadata } from "next";
import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { CollabBanner } from "@/components/sections/collab-banner";
import { Drops } from "@/components/sections/drops";
import { Hero } from "@/components/sections/hero";
import { Lookbook } from "@/components/sections/lookbook";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { WordmarkChain } from "@/components/sections/wordmark-chain";

function DropsSkeleton() {
	return (
		<section className="border-b-2 border-foreground bg-background">
			<div className="grid lg:grid-cols-2">
				<div className="yns-bg-lime p-8 sm:p-16 min-h-[400px]" />
				<div className="grid grid-cols-2 grid-rows-2 min-h-[400px]">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={`drops-skel-${i}`} className="bg-secondary border border-foreground animate-pulse" />
					))}
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
			<CollabBanner />
			<Suspense fallback={<DropsSkeleton />}>
				<Drops />
			</Suspense>
			<Lookbook />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="The Catalog" eyebrow="New Releases" limit={6} />
			<About />
			<WordmarkChain />
			<Newsletter />
		</>
	);
}
