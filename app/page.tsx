import { Suspense } from "react";
import { CategoryTiles } from "@/components/sections/category-tiles";
import { Hero } from "@/components/sections/hero";
import { LifestyleBand } from "@/components/sections/lifestyle-band";
import { MiniEdit } from "@/components/sections/mini-edit";
import { Newsletter } from "@/components/sections/newsletter";
import { PrintAndPattern } from "@/components/sections/print-pattern";
import { ProductGrid } from "@/components/sections/product-grid";
import { ShopByEdit } from "@/components/sections/shop-by-edit";

function ProductGridSkeleton() {
	return (
		<section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-20">
			<div className="flex flex-col items-center text-center mb-10 sm:mb-14">
				<div className="h-3 w-24 bg-cream rounded animate-pulse mb-3" />
				<div className="h-10 w-56 bg-cream rounded animate-pulse" />
			</div>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[3/4] bg-cream animate-pulse" />
						<div className="mt-4 space-y-2 flex flex-col items-center">
							<div className="h-4 w-3/4 bg-cream rounded animate-pulse" />
							<div className="h-4 w-1/3 bg-cream rounded animate-pulse" />
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
			<CategoryTiles />
			<ShopByEdit />
			<PrintAndPattern />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid
					title="Best Sellers"
					eyebrow="Loved By You"
					description="Tried, tested and twirled in — the pieces our customers reach for again and again."
					limit={8}
					columns={4}
				/>
			</Suspense>
			<LifestyleBand />
			<MiniEdit />
			<Newsletter />
		</>
	);
}
