import { Suspense } from "react";
import { BeautifulDetails } from "@/components/sections/beautiful-details";
import { BeautifulPractical } from "@/components/sections/beautiful-practical";
import { ClassicHandbags } from "@/components/sections/classic-handbags";
import { Hero } from "@/components/sections/hero";
import { JournalSection } from "@/components/sections/journal-section";
import { ProductGrid } from "@/components/sections/product-grid";
import { PromoBar } from "@/components/sections/promo-bar";
import { SimpleElegant } from "@/components/sections/simple-elegant";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="text-center mb-12">
				<div className="h-8 w-48 bg-secondary mx-auto animate-pulse" />
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[3/4] bg-secondary mb-4 animate-pulse" />
						<div className="space-y-2">
							<div className="h-4 w-3/4 bg-secondary animate-pulse" />
							<div className="h-4 w-1/4 bg-secondary animate-pulse" />
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
			<ClassicHandbags />
			<BeautifulPractical />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Popular picks" limit={4} />
			</Suspense>
			<PromoBar />
			<BeautifulDetails />
			<JournalSection />
			<SimpleElegant />
		</main>
	);
}
