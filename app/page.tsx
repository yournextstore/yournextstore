import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { Ingredients } from "@/components/sections/ingredients";
import { Intro } from "@/components/sections/intro";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
			<div className="flex items-end justify-between mb-10">
				<div>
					<div className="h-9 w-48 bg-sand rounded animate-pulse" />
					<div className="mt-2 h-4 w-64 bg-sand/70 rounded animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-sand rounded-3xl mb-4 animate-pulse" />
						<div className="space-y-2 px-1">
							<div className="h-5 w-3/4 bg-sand rounded animate-pulse" />
							<div className="h-4 w-1/4 bg-sand rounded animate-pulse" />
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
			<Intro />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid
					title="The Apothecary"
					description="Small-batch staples, picked petal by petal"
					limit={8}
				/>
			</Suspense>
			<About />
			<Ingredients />
			<Newsletter />
		</>
	);
}
