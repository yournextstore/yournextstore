import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { DreamDecor } from "@/components/sections/dream-decor";
import { FeaturedCollection } from "@/components/sections/featured-collection";
import { Hero } from "@/components/sections/hero";
import { Journal } from "@/components/sections/journal";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { SustainableBanner } from "@/components/sections/sustainable-banner";

function ProductGridSkeleton() {
	return (
		<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-20 sm:pt-28">
			<div className="flex items-end justify-between mb-10">
				<div>
					<div className="h-4 w-40 bg-secondary rounded animate-pulse" />
					<div className="mt-3 h-12 w-72 bg-secondary rounded animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[4/5] bg-secondary rounded-2xl mb-4 animate-pulse" />
						<div className="space-y-2">
							<div className="h-4 w-3/4 bg-secondary rounded animate-pulse" />
							<div className="h-3 w-1/4 bg-secondary rounded animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<main className="pb-20">
			<Hero />
			<DreamDecor />
			<FeaturedCollection />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid limit={8} />
			</Suspense>
			<SustainableBanner />
			<About />
			<Journal />
			<Newsletter />
		</main>
	);
}
