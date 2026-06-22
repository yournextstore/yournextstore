import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { MaterialStrip } from "@/components/sections/material-strip";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { Tribute } from "@/components/sections/tribute";

function ProductGridSkeleton() {
	return (
		<section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20 sm:py-28">
			<div className="mb-12 space-y-3">
				<div className="h-3 w-24 bg-secondary rounded animate-pulse" />
				<div className="h-12 w-72 bg-secondary rounded animate-pulse" />
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[4/5] bg-secondary mb-5 animate-pulse" />
						<div className="space-y-2">
							<div className="h-5 w-3/4 bg-secondary rounded animate-pulse" />
							<div className="h-4 w-1/4 bg-secondary rounded animate-pulse" />
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
				<ProductGrid
					title="The Menu"
					description="A small, slowly-rotating selection of pieces in stock today — each named, dated, and finished by hand."
					eyebrow="Vol. 01 — featured"
					limit={6}
				/>
			</Suspense>
			<Tribute />
			<MaterialStrip />
			<About />
			<Newsletter />
		</>
	);
}
