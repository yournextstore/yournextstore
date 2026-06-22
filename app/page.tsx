import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { Notes } from "@/components/sections/notes";
import { Perks } from "@/components/sections/perks";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="bg-luxe-canvas">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="flex items-end justify-between mb-12">
					<div>
						<div className="h-4 w-32 bg-secondary rounded animate-pulse" />
						<div className="mt-3 h-12 w-72 bg-secondary rounded animate-pulse" />
					</div>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={`skeleton-${i}`}>
							<div className="aspect-[4/5] bg-secondary rounded-3xl mb-4 animate-pulse" />
							<div className="space-y-2">
								<div className="h-5 w-3/4 bg-secondary rounded animate-pulse" />
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
			<Perks />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid limit={6} />
			</Suspense>
			<Suspense>
				<Notes />
			</Suspense>
			<About />
			<Newsletter />
		</>
	);
}
