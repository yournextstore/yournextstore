import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Affirmations } from "@/components/sections/affirmations";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pb-24 sm:pb-32 pt-4">
			<div className="flex items-end justify-between mb-8">
				<div className="h-7 w-72 bg-secondary animate-pulse" />
				<div className="h-4 w-44 bg-secondary animate-pulse" />
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-secondary mb-4 animate-pulse" />
						<div className="space-y-2 px-1">
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
		<>
			<Hero />
			<Affirmations />
			<About />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Your Healthy Hair Routine Starts Here" limit={8} />
			</Suspense>
			<Newsletter />
		</>
	);
}
