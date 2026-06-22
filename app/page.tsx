import { Suspense } from "react";
import { Editorial } from "@/components/sections/editorial";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";
import { Routine } from "@/components/sections/routine";
import { Testimonials } from "@/components/sections/testimonials";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="flex items-end justify-between mb-12">
				<div className="h-8 w-64 bg-yns-pink-soft/40 rounded animate-pulse" />
				<div className="h-5 w-20 bg-yns-pink-soft/40 rounded animate-pulse" />
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-yns-pink-soft/40 rounded-[28px] mb-5 animate-pulse" />
						<div className="space-y-2">
							<div className="h-4 w-3/4 mx-auto bg-yns-pink-soft/40 rounded animate-pulse" />
							<div className="h-4 w-1/4 mx-auto bg-yns-pink-soft/40 rounded animate-pulse" />
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
				<ProductGrid title="Shop Our Best Sellers" limit={4} />
			</Suspense>
			<Editorial />
			<Routine />
			<Press />
			<Testimonials />
			<Newsletter />
		</>
	);
}
