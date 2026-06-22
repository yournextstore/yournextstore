import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Bundles } from "@/components/sections/bundles";
import { EditorialBanner } from "@/components/sections/editorial-banner";
import { FAQ } from "@/components/sections/faq";
import { FeatureRow } from "@/components/sections/feature-row";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";
import { TheClub } from "@/components/sections/the-club";
import { UGCGrid } from "@/components/sections/ugc-grid";

function ProductGridSkeleton() {
	return (
		<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
			<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 sm:mb-16">
				<div className="max-w-2xl">
					<div className="h-3 w-32 bg-secondary animate-pulse" />
					<div className="mt-4 h-14 w-72 bg-secondary animate-pulse" />
					<div className="mt-4 h-5 w-64 bg-secondary animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[4/5] bg-secondary mb-5 animate-pulse" />
						<div className="space-y-2">
							<div className="h-5 w-3/4 bg-secondary animate-pulse" />
							<div className="h-3 w-1/4 bg-secondary animate-pulse" />
						</div>
					</div>
				))}
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
				<ProductGrid title="The catalog" limit={6} />
			</Suspense>
			<Bundles />
			<FeatureRow />
			<EditorialBanner />
			<TheClub />
			<PressStrip />
			<UGCGrid />
			<FAQ />
			<Newsletter />
		</>
	);
}
