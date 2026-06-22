import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { IngredientBand } from "@/components/sections/ingredient-band";
import { Manifesto } from "@/components/sections/manifesto";
import { Muses } from "@/components/sections/muses";
import { Newsletter } from "@/components/sections/newsletter";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";
import { Ritual } from "@/components/sections/ritual";

function ProductGridSkeleton() {
	return (
		<section className="bg-sand">
			<div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-24 sm:py-32">
				<div className="text-center mb-16">
					<div className="h-3 w-24 mx-auto bg-ink/10 animate-pulse" />
					<div className="mt-5 h-12 w-72 mx-auto bg-ink/10 animate-pulse" />
				</div>
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-14 sm:gap-x-8">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={`skeleton-${i}`}>
							<div className="aspect-[4/5] bg-bone animate-pulse mb-5" />
							<div className="text-center space-y-2">
								<div className="h-5 w-3/4 mx-auto bg-bone animate-pulse" />
								<div className="h-px w-6 mx-auto bg-ink/30" />
								<div className="h-4 w-16 mx-auto bg-bone animate-pulse" />
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
			<Manifesto />
			<Muses />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid
					title="Best Sellers"
					eyebrow="Volume Ⅰ"
					description="A small circle of objects, made in close quarters, returned to often."
					limit={4}
					tone="sand"
				/>
			</Suspense>
			<IngredientBand />
			<Ritual />
			<Press />
			<About />
			<Newsletter />
		</>
	);
}
