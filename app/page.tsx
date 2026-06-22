import { Suspense } from "react";
import { EditorialBand } from "@/components/sections/editorial-band";
import { FeaturesThreeUp } from "@/components/sections/features-three-up";
import { Hero } from "@/components/sections/hero";
import { HomeFAQ } from "@/components/sections/home-faq";
import { Insights } from "@/components/sections/insights";
import { InsightsEditorial } from "@/components/sections/insights-editorial";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { PromoBanner } from "@/components/sections/promo-banner";

function ProductGridSkeleton({ count = 8 }: { count?: number }) {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="flex items-end justify-between mb-12">
				<div>
					<div className="h-9 w-48 bg-[#f5f1ea] rounded animate-pulse" />
					<div className="mt-2 h-4 w-64 bg-[#f5f1ea] rounded animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{Array.from({ length: count }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-[#f5f1ea] rounded-[20px] mb-4 animate-pulse" />
						<div className="space-y-2">
							<div className="h-4 w-3/4 bg-[#f5f1ea] rounded animate-pulse" />
							<div className="h-4 w-1/4 bg-[#f5f1ea] rounded animate-pulse" />
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
			<EditorialBand />
			<Suspense fallback={<ProductGridSkeleton count={8} />}>
				<ProductGrid
					eyebrow="Catalogue"
					title="All Products"
					description="A quietly considered catalogue — sofas, seating, tables and accent pieces, made to last."
					limit={8}
					columns={4}
				/>
			</Suspense>
			<PromoBanner />
			<FeaturesThreeUp />
			<HomeFAQ />
			<Newsletter />
			<Insights />
			<InsightsEditorial />
		</main>
	);
}
