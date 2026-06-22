import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { CategoryBar } from "@/components/sections/category-bar";
import { Hero } from "@/components/sections/hero";
import { Lookbook } from "@/components/sections/lookbook";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-16">
			<div className="flex items-end justify-between mb-10">
				<div>
					<div className="h-12 w-72 bg-secondary rounded animate-pulse" />
				</div>
				<div className="h-6 w-48 bg-secondary rounded animate-pulse" />
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-secondary rounded-2xl mb-4 animate-pulse" />
						<div className="space-y-2">
							<div className="h-5 w-3/4 bg-secondary rounded animate-pulse" />
							<div className="h-5 w-1/4 bg-secondary rounded animate-pulse" />
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
			<Suspense fallback={<div className="h-20" />}>
				<CategoryBar />
			</Suspense>
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Newest Pieces" variant="newest" limit={6} />
			</Suspense>
			<Lookbook />
			<About />
			<Newsletter />
		</>
	);
}
