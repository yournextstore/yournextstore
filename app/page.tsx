import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { CategoryGrid } from "@/components/sections/category-grid";
import { CollectionTiles } from "@/components/sections/collection-tiles";
import { Hero } from "@/components/sections/hero";
import { Lookbook } from "@/components/sections/lookbook";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { Sustainability } from "@/components/sections/sustainability";

function ProductGridSkeleton() {
	return (
		<section className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-24">
			<div className="mb-12">
				<div className="h-3 w-24 bg-secondary mb-3 animate-pulse" />
				<div className="h-12 w-72 bg-secondary animate-pulse" />
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-12">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[3/4] bg-secondary mb-4 yns-image-shimmer" />
						<div className="flex justify-between">
							<div className="h-4 w-3/5 bg-secondary animate-pulse" />
							<div className="h-4 w-1/5 bg-secondary animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

function CollectionTilesSkeleton() {
	return (
		<section className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-24">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-x-3 gap-y-12">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={`tile-skel-${i}`} className="aspect-[3/4] bg-secondary yns-image-shimmer" />
				))}
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<>
			<Hero />
			<Suspense fallback={<CollectionTilesSkeleton />}>
				<CollectionTiles />
			</Suspense>
			<Sustainability />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="The wardrobe" eyebrow="— Capsule 003 —" limit={8} />
			</Suspense>
			<CategoryGrid />
			<Lookbook />
			<About />
			<Newsletter />
		</>
	);
}
