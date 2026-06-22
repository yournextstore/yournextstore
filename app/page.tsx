import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Gallery } from "@/components/sections/gallery";
import { Hero } from "@/components/sections/hero";
import { Ingredients } from "@/components/sections/ingredients";
import { Newsletter } from "@/components/sections/newsletter";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";
import { Recipes } from "@/components/sections/recipes";

function ProductGridSkeleton() {
	return (
		<section className="bg-cream-paper">
			<div className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
				<div className="mb-12 flex flex-col items-center">
					<div className="h-3 w-32 animate-pulse rounded-full bg-[color:#0f2a3f]/10" />
					<div className="mt-6 h-10 w-72 animate-pulse rounded bg-[color:#0f2a3f]/10" />
				</div>
				<div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={`skeleton-${i}`}>
							<div className="mb-4 aspect-square animate-pulse rounded-sm bg-[color:#0f2a3f]/10" />
							<div className="space-y-2">
								<div className="h-5 w-3/4 animate-pulse rounded bg-[color:#0f2a3f]/10" />
								<div className="h-5 w-1/4 animate-pulse rounded bg-[color:#0f2a3f]/10" />
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
			<About />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid limit={3} />
			</Suspense>
			<Ingredients />
			<Press />
			<Recipes />
			<Gallery />
			<Newsletter />
		</>
	);
}
