import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { CollectionStrip } from "@/components/sections/collection-strip";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section
			className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20 lg:py-28"
			style={{ backgroundColor: "#F4F1EC" }}
		>
			<div className="flex items-end justify-between mb-14">
				<div className="space-y-4">
					<div className="h-3 w-32 bg-muted rounded animate-pulse" />
					<div className="h-12 w-72 bg-muted rounded animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[4/5] bg-muted rounded-sm mb-4 animate-pulse" />
						<div className="space-y-2">
							<div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
							<div className="h-5 w-1/4 bg-muted rounded animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

function HeroSkeleton() {
	return (
		<section className="hero-backdrop">
			<div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-24 min-h-[60vh]" />
		</section>
	);
}

export default function Home() {
	return (
		<main>
			<Suspense fallback={<HeroSkeleton />}>
				<Hero />
			</Suspense>
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="The Collection" limit={6} />
			</Suspense>
			<Suspense>
				<CollectionStrip />
			</Suspense>
			<About />
			<Newsletter />
		</main>
	);
}
