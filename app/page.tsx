import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";
import { ScentIndex } from "@/components/sections/scent-index";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
			<div className="text-center mb-14">
				<div className="mx-auto h-4 w-44 bg-secondary rounded animate-pulse" />
				<div className="mx-auto mt-3 h-10 w-32 bg-secondary rounded animate-pulse" />
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[4/5] bg-secondary animate-pulse" />
						<div className="mt-6 mx-auto h-5 w-24 bg-secondary rounded animate-pulse" />
						<div className="mt-2 mx-auto h-3 w-40 bg-secondary rounded animate-pulse" />
					</div>
				))}
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<main className="bg-background">
			<Hero />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid limit={4} />
			</Suspense>
			<About />
			<ScentIndex />
			<Press />
			<Newsletter />
		</main>
	);
}
