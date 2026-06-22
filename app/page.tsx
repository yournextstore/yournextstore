import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Categories } from "@/components/sections/categories";
import { FaqPreview } from "@/components/sections/faq-preview";
import { Hero } from "@/components/sections/hero";
import { Journal } from "@/components/sections/journal";
import { ProductGrid } from "@/components/sections/product-grid";
import { ValueProps } from "@/components/sections/value-props";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="md:col-span-1 rounded-2xl bg-[var(--sand)]/60 h-72 animate-pulse" />
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-secondary rounded-2xl mb-4 animate-pulse" />
						<div className="space-y-2">
							<div className="h-4 w-3/4 bg-secondary rounded animate-pulse" />
							<div className="h-4 w-1/4 bg-secondary rounded animate-pulse" />
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
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid limit={3} variant="favorites" />
			</Suspense>
			<Suspense>
				<Categories />
			</Suspense>
			<About />
			<ValueProps />
			<FaqPreview />
			<Journal />
		</main>
	);
}
