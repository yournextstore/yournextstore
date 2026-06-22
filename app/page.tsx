import { Suspense } from "react";
import { Community } from "@/components/sections/community";
import { Editorial } from "@/components/sections/editorial";
import { FeatureRow } from "@/components/sections/feature-row";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";
import { Values } from "@/components/sections/values";

function ProductGridSkeleton() {
	return (
		<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 lg:py-28">
			<div className="flex items-end justify-between mb-12">
				<div>
					<div className="h-3 w-24 bg-secondary rounded animate-pulse" />
					<div className="mt-4 h-12 w-72 bg-secondary rounded animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[4/5] bg-secondary animate-pulse" />
						<div className="mt-5 flex justify-between">
							<div className="h-5 w-3/5 bg-secondary rounded animate-pulse" />
							<div className="h-5 w-1/5 bg-secondary rounded animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<main className="bg-[var(--cream)]">
			<Hero />
			<FeatureRow />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid
					title="Shop the essentials"
					eyebrow="— Featured"
					description="Quiet objects designed to live with you, season after season."
					limit={6}
				/>
			</Suspense>
			<Community />
			<Editorial />
			<Values />
			<Press />
			<Newsletter />
		</main>
	);
}
