import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Flavors } from "@/components/sections/flavors";
import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
			<div className="flex items-end justify-between mb-12">
				<div className="space-y-3">
					<div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
					<div className="h-10 w-64 bg-white/10 rounded animate-pulse" />
					<div className="h-4 w-72 bg-white/10 rounded animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-white/5 border border-white/10 rounded-2xl mb-4 animate-pulse" />
						<div className="space-y-2">
							<div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
							<div className="h-4 w-1/4 bg-white/10 rounded animate-pulse" />
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
			<Marquee />
			<About />
			<Flavors />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Featured Drops" description="Cool things, freshly poured." limit={6} />
			</Suspense>
			<Newsletter />
		</>
	);
}
