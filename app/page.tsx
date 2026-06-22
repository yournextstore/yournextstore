import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { BenefitsStrip } from "@/components/sections/benefits-strip";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
				<div className="flex items-end justify-between mb-10">
					<div>
						<div className="h-6 w-32 bg-secondary rounded-full animate-pulse" />
						<div className="mt-3 h-10 w-72 bg-secondary rounded animate-pulse" />
					</div>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={`skeleton-${i}`}>
							<div className="aspect-square bg-[--color-butter] rounded-3xl mb-4 animate-pulse" />
							<div className="space-y-2 text-center">
								<div className="h-4 w-3/4 mx-auto bg-secondary rounded animate-pulse" />
								<div className="h-4 w-1/4 mx-auto bg-secondary rounded animate-pulse" />
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
			<BenefitsStrip />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Variety Packs" limit={4} />
			</Suspense>
			<About />
			<Newsletter />
		</>
	);
}
