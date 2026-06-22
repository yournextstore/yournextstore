import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="mt-4 sm:mt-5 rounded-[2rem] bg-white p-4 sm:p-6 lg:p-8 ring-1 ring-black/5">
			<div className="flex items-end justify-between mb-7 px-1">
				<div>
					<div className="h-8 w-56 bg-neutral-100 rounded animate-pulse" />
					<div className="mt-2 h-4 w-72 bg-neutral-100 rounded animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[4/5] bg-neutral-100 rounded-[1.75rem] mb-3 animate-pulse" />
						<div className="h-14 bg-neutral-100 rounded-[1.5rem] animate-pulse" />
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
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Featured Furniture" limit={3} />
			</Suspense>
			<About />
			<Newsletter />
		</>
	);
}
