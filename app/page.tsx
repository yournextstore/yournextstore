import { Suspense } from "react";
import { CareCategories } from "@/components/sections/care-categories";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { PromoBanners } from "@/components/sections/promo-banners";
import { Spotlight } from "@/components/sections/spotlight";

function ProductGridSkeleton() {
	return (
		<section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
			<div className="mb-8 flex items-end justify-between">
				<div>
					<div className="h-9 w-72 animate-pulse rounded bg-secondary" />
					<div className="mt-2 h-4 w-48 animate-pulse rounded bg-secondary" />
				</div>
			</div>
			<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="mb-3 aspect-square animate-pulse rounded-2xl bg-secondary" />
						<div className="space-y-2">
							<div className="h-4 w-3/4 animate-pulse rounded bg-secondary" />
							<div className="h-4 w-1/3 animate-pulse rounded bg-secondary" />
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
			<Suspense>
				<CareCategories />
			</Suspense>
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Today's best deals for you" limit={8} />
			</Suspense>
			<PromoBanners />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid
					title="Healthy Food Collection"
					description="Nutrition for every age — baby food, supplements, and pediatric formulas."
					limit={4}
					viewAllLabel="See all"
				/>
			</Suspense>
			<Spotlight />
			<Newsletter />
		</>
	);
}
