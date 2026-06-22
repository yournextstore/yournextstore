import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Benefits } from "@/components/sections/benefits";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { Testimonial } from "@/components/sections/testimonial";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
			<div className="mb-10">
				<div className="h-9 w-56 bg-secondary animate-pulse" />
				<div className="mt-3 h-4 w-72 bg-secondary animate-pulse" />
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-secondary mb-4 animate-pulse" />
						<div className="flex justify-between">
							<div className="h-4 w-2/3 bg-secondary animate-pulse" />
							<div className="h-4 w-12 bg-secondary animate-pulse" />
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
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Featured products" description="Here's some of our best-sellers!" limit={3} />
			</Suspense>
			<Benefits />
			<About />
			<Testimonial />
			<Newsletter />
		</>
	);
}
