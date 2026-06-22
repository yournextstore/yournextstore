import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { Materials } from "@/components/sections/materials";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
			<div className="mb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
				<div className="lg:col-span-7 space-y-3">
					<div className="h-3 w-24 bg-secondary rounded animate-pulse" />
					<div className="h-14 w-3/4 bg-secondary rounded animate-pulse" />
				</div>
				<div className="lg:col-span-5 lg:pl-8 lg:border-l lg:border-border/70 space-y-3">
					<div className="h-4 w-full bg-secondary rounded animate-pulse" />
					<div className="h-4 w-2/3 bg-secondary rounded animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[4/5] bg-secondary rounded-sm mb-4 animate-pulse" />
						<div className="space-y-2">
							<div className="h-5 w-3/4 bg-secondary rounded animate-pulse" />
							<div className="h-5 w-1/4 bg-secondary rounded animate-pulse" />
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
				<ProductGrid title="The Collection" limit={6} />
			</Suspense>
			<Materials />
			<About />
			<Newsletter />
		</>
	);
}
