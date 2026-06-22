import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="granite py-24 sm:py-32 border-t border-white/5">
			<div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
				<div className="mb-14 space-y-4">
					<div className="h-3 w-32 bg-white/10 rounded animate-pulse" />
					<div className="h-14 w-2/3 bg-white/10 rounded animate-pulse" />
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={`skeleton-${i}`}>
							<div className="aspect-[4/5] bg-white/5 rounded-2xl mb-4 animate-pulse" />
							<div className="space-y-2">
								<div className="h-5 w-3/4 bg-white/10 rounded animate-pulse" />
								<div className="h-4 w-1/4 bg-white/10 rounded animate-pulse" />
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
		<main className="bg-background">
			<Hero />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="The Flavor Lineup" limit={6} />
			</Suspense>
			<About />
			<Newsletter />
		</main>
	);
}
