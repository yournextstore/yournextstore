import { Suspense } from "react";
import { CategoryTiles } from "@/components/sections/category-tiles";
import { Hero } from "@/components/sections/hero";
import { Lookbook } from "@/components/sections/lookbook";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="skylrk-drop-bg py-20 sm:py-28">
			<div className="max-w-[1400px] mx-auto px-6">
				<div className="flex items-end justify-between mb-14">
					<div>
						<div className="h-4 w-32 bg-secondary rounded animate-pulse mb-3" />
						<div className="h-10 w-64 bg-secondary rounded animate-pulse" />
					</div>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={`skeleton-${i}`}>
							<div className="aspect-[4/5] bg-secondary rounded-2xl mb-5 animate-pulse" />
							<div className="space-y-2">
								<div className="h-4 w-3/4 bg-secondary rounded animate-pulse" />
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
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Featured drop" limit={6} />
			</Suspense>
			<Lookbook />
			<Suspense>
				<CategoryTiles />
			</Suspense>
			<Newsletter />
		</>
	);
}
