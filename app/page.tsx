import { Suspense } from "react";
import { EditorialPortrait } from "@/components/sections/editorial-portrait";
import { Hero } from "@/components/sections/hero";
import { NaturalIngredients } from "@/components/sections/natural-ingredients";
import { ProductGrid } from "@/components/sections/product-grid";
import { Reviews } from "@/components/sections/reviews";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="mb-10">
				<div className="h-3 w-24 bg-secondary rounded animate-pulse" />
				<div className="mt-3 h-10 w-64 bg-secondary rounded animate-pulse" />
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[4/5] bg-sand rounded-sm mb-4 animate-pulse" />
						<div className="space-y-2 text-center">
							<div className="h-4 w-2/3 mx-auto bg-secondary rounded animate-pulse" />
							<div className="h-4 w-1/4 mx-auto bg-secondary rounded animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<main>
			<Hero />
			<NaturalIngredients />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="The Edit" eyebrow="Featured Collection" limit={4} />
			</Suspense>
			<EditorialPortrait />
			<Reviews />
		</main>
	);
}
