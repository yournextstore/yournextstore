import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Categories } from "@/components/sections/categories";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { Promo } from "@/components/sections/promo";

function ProductGridSkeleton() {
	return (
		<section className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-20 sm:py-28">
			<div className="flex items-end justify-between mb-12">
				<div>
					<div className="h-8 w-48 bg-secondary rounded animate-pulse" />
					<div className="mt-2 h-5 w-64 bg-secondary rounded animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[4/5] bg-secondary rounded-3xl mb-4 animate-pulse" />
						<div className="space-y-2">
							<div className="h-5 w-3/4 bg-secondary rounded animate-pulse" />
							<div className="h-4 w-1/3 bg-secondary rounded animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

function CategoriesSkeleton() {
	return (
		<section className="bg-[var(--olive-deep)] py-20 sm:py-28">
			<div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={`cat-${i}`} className="aspect-[3/4] rounded-3xl bg-[var(--cream)]/5 animate-pulse" />
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
			<Suspense fallback={<CategoriesSkeleton />}>
				<Categories />
			</Suspense>
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Popular Products" eyebrow="This Season" limit={8} />
			</Suspense>
			<Promo />
			<About />
			<Newsletter />
		</>
	);
}
