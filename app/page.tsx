import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { CategoryTiles } from "@/components/sections/category-tiles";
import { CommunityGallery } from "@/components/sections/community-gallery";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";
import { PromoBanner } from "@/components/sections/promo-banner";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="text-center mb-12">
				<div className="mx-auto h-4 w-32 bg-secondary rounded animate-pulse" />
				<div className="mx-auto mt-3 h-9 w-72 bg-secondary rounded animate-pulse" />
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-secondary rounded-[28px] mb-4 animate-pulse" />
						<div className="space-y-2">
							<div className="h-4 w-3/4 mx-auto bg-secondary rounded animate-pulse" />
							<div className="h-4 w-1/3 mx-auto bg-secondary rounded animate-pulse" />
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
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid
					title="Featured Plushies"
					eyebrow="Just landed"
					description="Brand new cuddly friends, fresh off the workshop bench."
					limit={8}
				/>
			</Suspense>
			<Suspense>
				<CategoryTiles />
			</Suspense>
			<PromoBanner />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid
					title="New on the shelf"
					eyebrow="Spring arrivals"
					description="Hot off the cutting table — pet, pat and pre-order before they hop away."
					limit={4}
					showViewAll={false}
					background="cream"
				/>
			</Suspense>
			<PressStrip />
			<CommunityGallery />
			<About />
			<Newsletter />
		</>
	);
}
