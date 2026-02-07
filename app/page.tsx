import { Suspense } from "react";
import { Hero } from "@/components/sections/hero";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
			<div className="text-center mb-16">
				<div className="h-4 w-24 bg-secondary mx-auto mb-4 animate-pulse" />
				<div className="h-10 w-64 bg-secondary mx-auto animate-pulse" />
				<div className="mt-4 h-5 w-80 bg-secondary mx-auto animate-pulse" />
				<div className="mt-6 w-24 h-px bg-primary/30 mx-auto" />
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[3/4] bg-secondary mb-6 animate-pulse" />
						<div className="text-center space-y-2">
							<div className="h-4 w-3/4 bg-secondary mx-auto animate-pulse" />
							<div className="h-5 w-1/4 bg-secondary mx-auto animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<main>
			<Hero />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Signature Pieces" description="Each piece crafted to capture the essence of timeless beauty" limit={6} />
			</Suspense>
		</main>
	);
}
