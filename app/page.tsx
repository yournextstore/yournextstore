import { Suspense } from "react";
import { FarmStory } from "@/components/sections/farm-story";
import { FlavorFeatures } from "@/components/sections/flavor-features";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { PressMarquee } from "@/components/sections/press-marquee";
import { ProductGrid } from "@/components/sections/product-grid";
import { ValuesStrip } from "@/components/sections/values-strip";

function ProductGridSkeleton() {
	return (
		<section className="bg-[#f5e6d3]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="text-center max-w-2xl mx-auto mb-14">
					<div className="mx-auto h-6 w-32 rounded bg-[#ecdcc1] animate-pulse" />
					<div className="mx-auto mt-4 h-12 w-72 rounded bg-[#ecdcc1] animate-pulse" />
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={`skeleton-${i}`}>
							<div className="aspect-square bg-[#ecdcc1] rounded-2xl mb-4 animate-pulse" />
							<div className="space-y-2">
								<div className="h-5 w-3/4 bg-[#ecdcc1] rounded animate-pulse" />
								<div className="h-5 w-1/4 bg-[#ecdcc1] rounded animate-pulse" />
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
		<>
			<Hero />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Meet the Flavors" limit={6} />
			</Suspense>
			<FlavorFeatures />
			<FarmStory />
			<ValuesStrip />
			<PressMarquee />
			<Newsletter />
		</>
	);
}
