import { Suspense } from "react";
import { Engineering, Lifestyle, PressRow, Reserve, SpecStrip } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="bg-background">
			<div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-20 sm:py-28">
				<div className="mb-12">
					<div className="h-3 w-24 bg-secondary animate-pulse" />
					<div className="mt-4 h-10 w-72 bg-secondary animate-pulse" />
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={`skeleton-${i}`} className="bg-[#f2f3f5]">
							<div className="aspect-square bg-secondary animate-pulse" />
							<div className="p-6 space-y-2 bg-background">
								<div className="h-4 w-3/4 bg-secondary animate-pulse" />
								<div className="h-3 w-1/4 bg-secondary animate-pulse" />
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<>
			<Hero />
			<SpecStrip />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="The Family" limit={6} />
			</Suspense>
			<Engineering />
			<Lifestyle />
			<PressRow />
			<Reserve />
			<Newsletter />
		</>
	);
}
