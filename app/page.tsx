import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Features } from "@/components/sections/features";
import { Hero } from "@/components/sections/hero";
import { InstagramGrid } from "@/components/sections/instagram";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="bg-[#f2f2f2] py-24 sm:py-32">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mb-14">
					<div className="h-3 w-24 bg-[#0e0e0e]/10 animate-pulse" />
					<div className="mt-4 h-12 w-72 bg-[#0e0e0e]/10 animate-pulse" />
					<div className="mt-3 h-4 w-96 bg-[#0e0e0e]/10 animate-pulse" />
				</div>
				<div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={`skeleton-${i}`}>
							<div className="aspect-[4/5] bg-[#0e0e0e]/10 animate-pulse" />
							<div className="mt-4 space-y-2">
								<div className="h-4 w-3/4 bg-[#0e0e0e]/10 animate-pulse" />
								<div className="h-3 w-1/4 bg-[#0e0e0e]/10 animate-pulse" />
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<main>
			<Hero />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="The Lineup" limit={6} />
			</Suspense>
			<Features />
			<About />
			<PressStrip />
			<Newsletter />
			<InstagramGrid />
		</main>
	);
}
