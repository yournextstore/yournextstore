import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { Ingredients } from "@/components/sections/ingredients";
import { LifestyleGallery } from "@/components/sections/lifestyle-gallery";
import { Newsletter } from "@/components/sections/newsletter";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="bg-[var(--tropic-cream)] rounded-t-[40px] sm:rounded-t-[64px]">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="flex items-end justify-between mb-12">
					<div>
						<div className="h-8 w-48 bg-[var(--muted)] rounded animate-pulse" />
						<div className="mt-2 h-5 w-64 bg-[var(--muted)] rounded animate-pulse" />
					</div>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={`skeleton-${i}`}>
							<div className="aspect-[4/5] bg-[var(--muted)] rounded-[28px] mb-4 animate-pulse" />
							<div className="space-y-2">
								<div className="h-5 w-3/4 bg-[var(--muted)] rounded animate-pulse" />
								<div className="h-5 w-1/4 bg-[var(--muted)] rounded animate-pulse" />
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
				<ProductGrid
					title="The Lineup"
					description="Six plants. One mission: keep biters away, naturally."
					limit={6}
				/>
			</Suspense>
			<Ingredients />
			<Press />
			<LifestyleGallery />
			<About />
			<Newsletter />
		</>
	);
}
