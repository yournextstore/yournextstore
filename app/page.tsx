import { Suspense } from "react";
import { About, PractitionerStrip, ResearchCallout } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="bg-background">
			<div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
				<div className="mb-14">
					<div className="h-3 w-20 bg-secondary rounded animate-pulse" />
					<div className="mt-4 h-10 w-72 bg-secondary rounded animate-pulse" />
					<div className="mt-3 h-5 w-64 bg-secondary rounded animate-pulse" />
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={`skeleton-${i}`}>
							<div className="aspect-[4/5] bg-secondary rounded-md mb-5 animate-pulse" />
							<div className="space-y-2">
								<div className="h-4 w-3/4 bg-secondary rounded animate-pulse" />
								<div className="h-4 w-1/4 bg-secondary rounded animate-pulse" />
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
			<PractitionerStrip />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid
					title="The protocol"
					description="Three formulations engineered to compound — one daily ritual."
					eyebrow="The system"
					limit={6}
				/>
			</Suspense>
			<About />
			<ResearchCallout />
			<Newsletter />
		</>
	);
}
