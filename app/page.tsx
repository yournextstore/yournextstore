import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { EditorialStatement } from "@/components/sections/editorial-statement";
import { Hero } from "@/components/sections/hero";
import { IngredientStrip } from "@/components/sections/ingredient-strip";
import { Newsletter } from "@/components/sections/newsletter";
import { PressRow } from "@/components/sections/press-row";
import { ProductGrid } from "@/components/sections/product-grid";
import { RecipeFeature } from "@/components/sections/recipe-feature";

function ProductGridSkeleton() {
	return (
		<section className="bg-[var(--brand-cream)] pb-24 pt-4">
			<div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
				<div className="mb-14 flex items-end justify-between">
					<div className="space-y-3">
						<div className="h-3 w-32 animate-pulse bg-[var(--brand-ink)]/10" />
						<div className="h-9 w-64 animate-pulse bg-[var(--brand-ink)]/10" />
					</div>
				</div>
				<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={`skeleton-${i}`}>
							<div className="aspect-[4/5] animate-pulse bg-[var(--brand-ink)]/10" />
							<div className="mt-4 flex items-center justify-between">
								<div className="h-4 w-32 animate-pulse bg-[var(--brand-ink)]/10" />
								<div className="h-4 w-16 animate-pulse bg-[var(--brand-ink)]/10" />
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
		<main className="bg-[var(--brand-cream)]">
			<Hero />
			<EditorialStatement />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="The Lineup" limit={3} />
			</Suspense>
			<IngredientStrip />
			<RecipeFeature />
			<PressRow />
			<About />
			<Newsletter />
		</main>
	);
}
