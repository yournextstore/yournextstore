import { Suspense } from "react";
import { Editorial } from "@/components/sections/editorial";
import { Hero } from "@/components/sections/hero";
import { Ingredients } from "@/components/sections/ingredients";
import { Newsletter } from "@/components/sections/newsletter";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";
import { Ritual } from "@/components/sections/ritual";
import { ShowcaseStrip } from "@/components/sections/showcase-strip";
import { Testimonial } from "@/components/sections/testimonial";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-20 sm:py-28">
			<div className="flex flex-col items-center text-center mb-14">
				<div className="h-3 w-32 bg-cream rounded animate-pulse" />
				<div className="mt-4 h-10 w-72 bg-cream rounded animate-pulse" />
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12 sm:gap-x-8">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[4/5] bg-cream animate-pulse" />
						<div className="mt-5 space-y-2 flex flex-col items-center">
							<div className="h-5 w-3/5 bg-cream animate-pulse" />
							<div className="h-3 w-1/3 bg-cream animate-pulse" />
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
			<Ritual />
			<ShowcaseStrip />
			<Editorial />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="The Bestsellers" eyebrow="— Loved by many" limit={4} />
			</Suspense>
			<Testimonial />
			<Press />
			<Ingredients />
			<Newsletter />
		</>
	);
}
