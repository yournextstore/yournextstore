import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { FeatureRow } from "@/components/sections/feature-row";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { Philosophy } from "@/components/sections/philosophy";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";
import { RitualBanner } from "@/components/sections/ritual-banner";

function ProductGridSkeleton() {
	return (
		<section className="bg-[#f2ebdd]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="text-center mb-14 sm:mb-20">
					<div className="h-3 w-32 bg-foreground/10 rounded mx-auto" />
					<div className="mt-5 h-10 w-72 bg-foreground/10 rounded mx-auto" />
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 sm:gap-x-8 sm:gap-y-16">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={`skeleton-${i}`}>
							<div className="aspect-[4/5] bg-foreground/5 mb-5 animate-pulse" />
							<div className="space-y-2 text-center">
								<div className="h-5 w-3/4 mx-auto bg-foreground/10 rounded animate-pulse" />
								<div className="h-3 w-1/3 mx-auto bg-foreground/10 rounded animate-pulse" />
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
			<About />
			<FeatureRow />
			<Philosophy />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="The Collection" eyebrow="Chapter Three" limit={4} columns={4} />
			</Suspense>
			<Press />
			<RitualBanner />
			<Newsletter />
		</>
	);
}
