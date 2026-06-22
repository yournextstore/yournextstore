import { Suspense } from "react";
import { CategoryPills } from "@/components/sections/category-pills";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { PromoTiles } from "@/components/sections/promo-tiles";

function PillsSkeleton() {
	return (
		<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div className="h-24 animate-pulse rounded-3xl bg-white shadow-card" />
		</section>
	);
}

function ProductGridSkeleton() {
	return (
		<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
			<div className="mb-6 flex items-end justify-between">
				<div className="h-8 w-44 animate-pulse rounded-md bg-secondary" />
				<div className="h-5 w-20 animate-pulse rounded-md bg-secondary" />
			</div>
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
				{Array.from({ length: 10 }).map((_, i) => (
					<div key={`skeleton-${i}`} className="rounded-2xl bg-white p-3 shadow-soft">
						<div className="aspect-square animate-pulse rounded-xl bg-secondary" />
						<div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-secondary" />
						<div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-secondary" />
						<div className="mt-3 h-5 w-1/3 animate-pulse rounded bg-secondary" />
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
			<Suspense fallback={<PillsSkeleton />}>
				<CategoryPills />
			</Suspense>
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid
					title="You might need"
					description="Fresh staples picked just for you"
					limit={10}
					viewAllHref="/products"
				/>
			</Suspense>
			<PromoTiles />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid
					title="Weekly best selling items"
					description="What other shoppers are loving this week"
					limit={10}
					offset={10}
					viewAllHref="/products"
					tone="muted"
				/>
			</Suspense>
			<CtaBanner />
			<Newsletter />
		</>
	);
}
