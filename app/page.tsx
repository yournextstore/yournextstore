import { Suspense } from "react";
import { Bundle } from "@/components/sections/bundle";
import { FaqHome } from "@/components/sections/faq-home";
import { FlavorFeatures } from "@/components/sections/flavor-features";
import { Hero } from "@/components/sections/hero";
import { Ingredients } from "@/components/sections/ingredients";
import { Newsletter } from "@/components/sections/newsletter";
import { PressMarquee } from "@/components/sections/press-marquee";
import { ProductGrid } from "@/components/sections/product-grid";
import { Testimonials } from "@/components/sections/testimonials";

function ProductGridSkeleton() {
	return (
		<section className="bg-espresso">
			<div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-20 sm:py-28">
				<div className="text-center mb-14">
					<div className="h-3 w-40 bg-cocoa mx-auto rounded animate-pulse" />
					<div className="mt-5 h-12 w-72 bg-cocoa mx-auto rounded animate-pulse" />
				</div>
				<div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={`skeleton-${i}`}>
							<div className="aspect-square bg-cocoa mb-5 animate-pulse" />
							<div className="space-y-2">
								<div className="h-5 w-3/4 bg-cocoa rounded animate-pulse" />
								<div className="h-4 w-1/4 bg-cocoa rounded animate-pulse" />
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
			<FlavorFeatures />
			<Ingredients />
			<Testimonials />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="The lineup" limit={6} />
			</Suspense>
			<Bundle />
			<PressMarquee />
			<FaqHome />
			<Newsletter />
		</>
	);
}
