import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { BenefitsMarquee } from "@/components/sections/benefits-marquee";
import { BigPromo } from "@/components/sections/big-promo";
import { FlavorGrid } from "@/components/sections/flavor-grid";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="bg-background">
			<div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 sm:py-24 lg:px-10">
				<div className="mb-16">
					<div className="h-3 w-24 animate-pulse bg-secondary" />
					<div className="mt-3 h-16 w-72 animate-pulse bg-secondary" />
				</div>
				<div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={`skeleton-${i}`}>
							<div className="aspect-square animate-pulse bg-secondary" />
							<div className="mt-4 flex justify-between gap-4">
								<div className="h-5 w-3/4 animate-pulse bg-secondary" />
								<div className="h-5 w-1/4 animate-pulse bg-secondary" />
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
			<BenefitsMarquee />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Shop The Lineup" limit={6} />
			</Suspense>
			<About />
			<FlavorGrid />
			<BigPromo />
			<Newsletter />
		</>
	);
}
