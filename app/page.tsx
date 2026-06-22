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

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="flex items-end justify-between mb-12">
				<div>
					<div className="h-8 w-48 bg-[var(--peach-light)] rounded animate-pulse" />
					<div className="mt-2 h-5 w-64 bg-[var(--peach-light)] rounded animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-[var(--peach-light)] rounded-3xl mb-4 animate-pulse" />
						<div className="space-y-2">
							<div className="h-5 w-3/4 bg-[var(--peach-light)] rounded animate-pulse" />
							<div className="h-5 w-1/4 bg-[var(--peach-light)] rounded animate-pulse" />
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
			<Suspense fallback={<PopularSkeleton />}>
				<WhatsPopular />
			</Suspense>
			<OurStory />
			<FlavorFeature />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid
					title="The Full Lineup"
					description="Every flavor we make, all in one place."
					limit={6}
				/>
			</Suspense>
			<Newsletter />
		</>
	);
}
