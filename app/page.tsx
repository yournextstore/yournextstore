import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

function FavoritesSkeleton() {
	return (
		<section className="sand-paper max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-8">
				<div className="lg:col-span-3 space-y-4">
					<div className="h-3 w-24 bg-[color:var(--sand)] rounded animate-pulse" />
					<div className="h-4 w-48 bg-[color:var(--sand)] rounded animate-pulse" />
					<div className="h-4 w-40 bg-[color:var(--sand)] rounded animate-pulse" />
				</div>
				<div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={`favorites-skeleton-${i}`}>
							<div className="aspect-square bg-[color:var(--sand)] rounded-sm animate-pulse" />
							<div className="mt-5 h-5 w-2/3 bg-[color:var(--sand)] rounded animate-pulse" />
							<div className="mt-2 h-4 w-1/3 bg-[color:var(--sand)] rounded animate-pulse" />
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
			<Suspense fallback={<FavoritesSkeleton />}>
				<ProductGrid
					title="Favorites"
					description="We have made a selection of our customers' favorite products."
					limit={3}
					variant="favorites"
				/>
			</Suspense>
			<About />
			<Suspense fallback={<FavoritesSkeleton />}>
				<ProductGrid
					title="The Atelier"
					description="A wider edit of new arrivals — slow-made objects, ready to live with."
					limit={6}
					variant="default"
				/>
			</Suspense>
			<Newsletter />
		</>
	);
}
