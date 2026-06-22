import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="text-center mb-14">
					<div className="h-3 w-32 bg-[var(--lavender-soft)] rounded mx-auto mb-3 animate-pulse" />
					<div className="h-12 w-72 bg-[var(--lavender-soft)] rounded mx-auto animate-pulse" />
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={`skeleton-${i}`} className="rounded-[28px] bg-[var(--lavender-soft)] p-5">
							<div className="aspect-square bg-white/70 rounded-2xl mb-4 animate-pulse" />
							<div className="space-y-2 px-1">
								<div className="h-5 w-3/4 bg-white/70 rounded animate-pulse" />
								<div className="h-4 w-1/4 bg-white/70 rounded animate-pulse" />
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
				<ProductGrid title="Pick your flavor" limit={3} />
			</Suspense>
			<About />
			<Press />
			<Newsletter />
		</>
	);
}
