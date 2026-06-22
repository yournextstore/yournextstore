import { Suspense } from "react";
import { BenefitsRow } from "@/components/sections/benefits-row";
import { Hero } from "@/components/sections/hero";
import { Ingredients } from "@/components/sections/ingredients";
import { LifestyleSplit } from "@/components/sections/lifestyle-split";
import { MissionBand } from "@/components/sections/mission-band";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";
import { Reviews } from "@/components/sections/reviews";

function ProductGridSkeleton() {
	return (
		<section className="bg-[#F5EFE6]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="mb-12">
					<div className="h-3 w-24 bg-[#EAE0CF] rounded animate-pulse mb-3" />
					<div className="h-10 w-80 bg-[#EAE0CF] rounded animate-pulse" />
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={`skeleton-${i}`}>
							<div className="aspect-square bg-[#EAE0CF] rounded-2xl mb-4 animate-pulse" />
							<div className="space-y-2">
								<div className="h-5 w-3/4 bg-[#EAE0CF] rounded animate-pulse" />
								<div className="h-5 w-1/4 bg-[#EAE0CF] rounded animate-pulse" />
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
			<MissionBand />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid limit={6} />
			</Suspense>
			<BenefitsRow />
			<Ingredients />
			<PressStrip />
			<LifestyleSplit />
			<Reviews />
			<Newsletter />
		</>
	);
}
