import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Chapters } from "@/components/sections/chapters";
import { Hero } from "@/components/sections/hero";
import { IngredientStory } from "@/components/sections/ingredient-story";
import { Newsletter } from "@/components/sections/newsletter";
import { PressMarquee } from "@/components/sections/press-marquee";
import { ProductGrid } from "@/components/sections/product-grid";
import { ScentQuiz } from "@/components/sections/scent-quiz";

function ProductGridSkeleton() {
	return (
		<section className="bg-ink py-20 sm:py-28">
			<div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
				<div className="mb-14 flex flex-col gap-6 sm:mb-20 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<div className="h-3 w-32 animate-pulse bg-secondary" />
						<div className="mt-4 h-12 w-72 animate-pulse bg-secondary" />
						<div className="mt-4 h-4 w-80 animate-pulse bg-secondary" />
					</div>
				</div>
				<div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={`skeleton-${i}`}>
							<div className="aspect-[4/5] animate-pulse bg-secondary" />
							<div className="mt-5 space-y-3">
								<div className="h-6 w-3/4 animate-pulse bg-secondary" />
								<div className="h-4 w-1/3 animate-pulse bg-secondary" />
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
		<main className="bg-ink">
			<Hero />
			<Chapters />
			<IngredientStory />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid limit={6} />
			</Suspense>
			<PressMarquee />
			<ScentQuiz />
			<About />
			<Newsletter />
		</main>
	);
}
