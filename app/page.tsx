import { Suspense } from "react";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-white border-2 border-yns-cocoa/10 rounded-sm yns-image-shimmer" />
						<div className="mt-4 space-y-2">
							<div className="h-5 w-3/4 bg-yns-cream-soft rounded" />
							<div className="h-4 w-1/3 bg-yns-cream-soft rounded" />
						</div>
						<div className="mt-3 h-11 w-full bg-yns-green/80 rounded-sm" />
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
				<ProductGrid limit={8} />
			</Suspense>
			<Newsletter />
		</>
	);
}
