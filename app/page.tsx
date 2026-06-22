import { Suspense } from "react";
import { Categories } from "@/components/sections/categories";
import { FounderStory } from "@/components/sections/founder-story";
import { Hero } from "@/components/sections/hero";
import { IngredientSpotlight } from "@/components/sections/ingredient-spotlight";
import { Marquee } from "@/components/sections/marquee";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { Testimonials } from "@/components/sections/testimonials";

function ProductGridSkeleton() {
	return (
		<section className="bg-[#F5F1EB]">
			<div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
				<div className="mb-12 text-center">
					<div className="mx-auto h-3 w-24 animate-pulse rounded bg-[#E8DFD3]" />
					<div className="mx-auto mt-4 h-10 w-72 animate-pulse rounded bg-[#E8DFD3]" />
				</div>
				<div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={`skeleton-${i}`}>
							<div className="aspect-[4/5] animate-pulse rounded-sm bg-[#E8DFD3]" />
							<div className="mt-5 space-y-2 text-center">
								<div className="mx-auto h-5 w-1/2 animate-pulse rounded bg-[#E8DFD3]" />
								<div className="mx-auto h-3 w-1/4 animate-pulse rounded bg-[#E8DFD3]" />
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
			<Marquee />
			<Categories />
			<IngredientSpotlight />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid
					title="Bestsellers"
					description="Quiet favorites from the collection."
					eyebrow="Loved most"
					limit={6}
				/>
			</Suspense>
			<FounderStory />
			<Testimonials />
			<Newsletter />
		</>
	);
}
