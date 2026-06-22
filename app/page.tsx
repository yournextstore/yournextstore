import { Suspense } from "react";
import { About, ValueProps } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="bg-[#fdf6cf]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="text-center mb-12">
					<div className="mx-auto h-7 w-28 bg-[#fcefa8] rounded-full animate-pulse" />
					<div className="mx-auto mt-4 h-10 w-72 bg-[#fcefa8] rounded animate-pulse" />
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={`skeleton-${i}`}>
							<div className="aspect-square bg-[#fcefa8] rounded-3xl mb-4 animate-pulse" />
							<div className="space-y-2 text-center">
								<div className="mx-auto h-5 w-2/3 bg-[#fcefa8] rounded animate-pulse" />
								<div className="mx-auto h-4 w-1/4 bg-[#fcefa8] rounded animate-pulse" />
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
			<ValueProps />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid
					title="Shop The Lineup"
					description="Three classic flavors, freshly milled, ready to bake."
					eyebrow="Bestsellers"
					limit={6}
				/>
			</Suspense>
			<About />
			<Newsletter />
		</>
	);
}
