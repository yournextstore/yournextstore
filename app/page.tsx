import { Suspense } from "react";
import { Benefits } from "@/components/sections/benefits";
import { Hero } from "@/components/sections/hero";
import { IngredientStory } from "@/components/sections/ingredient-story";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";
import { Reviews } from "@/components/sections/reviews";
import { SubscribeBanner } from "@/components/sections/subscribe-banner";

function ProductGridSkeleton() {
	return (
		<section className="bg-[#fdf6ee]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
				<div className="mb-12">
					<div className="h-7 w-32 bg-[#efe6d8] rounded animate-pulse" />
					<div className="mt-3 h-10 w-72 bg-[#efe6d8] rounded animate-pulse" />
				</div>
				<div className="grid grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={`skeleton-${i}`}>
							<div className="aspect-square bg-[#efe6d8] rounded-[1.5rem] mb-4 animate-pulse" />
							<div className="space-y-2 px-1">
								<div className="h-6 w-3/4 bg-[#efe6d8] rounded animate-pulse" />
								<div className="h-4 w-1/4 bg-[#efe6d8] rounded animate-pulse" />
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
			<Benefits />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid limit={6} />
			</Suspense>
			<SubscribeBanner />
			<PressStrip />
			<Reviews />
			<IngredientStory />
			<Newsletter />
		</>
	);
}
