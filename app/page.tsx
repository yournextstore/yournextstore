import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { InstaGrid } from "@/components/sections/insta-grid";
import { Marquee } from "@/components/sections/marquee";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";
import { RecipeSection } from "@/components/sections/recipe-section";
import { StoryRow } from "@/components/sections/story-row";

function ProductGridSkeleton() {
	return (
		<section className="bg-[#f5e4d2]">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-28">
				<div className="flex items-end justify-between mb-12">
					<div className="space-y-3">
						<div className="h-6 w-32 bg-[#ecd3b8] rounded animate-pulse" />
						<div className="h-12 w-72 bg-[#ecd3b8] rounded animate-pulse" />
						<div className="h-4 w-64 bg-[#ecd3b8] rounded animate-pulse" />
					</div>
				</div>
				<div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={`skeleton-${i}`}>
							<div className="aspect-[4/5] bg-[#ecd3b8] mb-4 animate-pulse" />
							<div className="space-y-2">
								<div className="h-5 w-3/4 bg-[#ecd3b8] rounded animate-pulse" />
								<div className="h-5 w-1/4 bg-[#ecd3b8] rounded animate-pulse" />
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
			<Marquee text="Holiday often" />
			<StoryRow />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="The Shop Edit" limit={6} />
			</Suspense>
			<RecipeSection />
			<PressStrip />
			<InstaGrid />
			<About />
			<Newsletter />
		</>
	);
}
