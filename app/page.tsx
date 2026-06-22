import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pb-16 sm:pb-24">
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-14">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[3/4] bg-[color:var(--cream)] mb-4 animate-pulse" />
						<div className="space-y-2">
							<div className="h-3 w-1/2 bg-secondary rounded animate-pulse" />
							<div className="h-3 w-3/4 bg-secondary rounded animate-pulse" />
							<div className="h-3 w-1/4 bg-secondary rounded animate-pulse" />
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
				<ProductGrid title="Women's Tops" limit={8} />
			</Suspense>
			<About />
			<Newsletter />
		</>
	);
}
