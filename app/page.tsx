import { Suspense } from "react";
import { FeatureBlocks } from "@/components/sections/feature-blocks";
import { Founder } from "@/components/sections/founder";
import { Hero } from "@/components/sections/hero";
import { Ingredients } from "@/components/sections/ingredients";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";
import { RitualBand } from "@/components/sections/ritual-band";
import { Science } from "@/components/sections/science";
import { Testimonials } from "@/components/sections/testimonials";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
			<div className="text-center max-w-xl mx-auto mb-14">
				<div className="h-3 w-32 bg-secondary rounded mx-auto animate-pulse" />
				<div className="mt-5 h-9 w-80 bg-secondary rounded mx-auto animate-pulse" />
				<div className="mt-4 h-5 w-96 bg-secondary rounded mx-auto animate-pulse" />
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[4/5] bg-secondary rounded-sm mb-5 animate-pulse" />
						<div className="space-y-2 text-center">
							<div className="h-5 w-3/4 bg-secondary rounded mx-auto animate-pulse" />
							<div className="h-4 w-1/4 bg-secondary rounded mx-auto animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<>
			<Hero />
			<Ingredients />
			<FeatureBlocks />
			<PressStrip />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid limit={6} />
			</Suspense>
			<Science />
			<Founder />
			<Testimonials />
			<RitualBand />
			<Newsletter />
		</>
	);
}
