import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { LookbookStrip } from "@/components/sections/lookbook-strip";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-28">
			<div className="text-center max-w-2xl mx-auto mb-14">
				<div className="mx-auto h-3 w-44 bg-muted rounded animate-pulse mb-5" />
				<div className="mx-auto h-12 w-72 bg-muted rounded animate-pulse" />
				<div className="mx-auto mt-5 h-4 w-3/4 bg-muted rounded animate-pulse" />
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[4/5] bg-muted rounded-md mb-4 animate-pulse" />
						<div className="space-y-2">
							<div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
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
				<ProductGrid limit={8} />
			</Suspense>
			<LookbookStrip />
			<About />
			<Newsletter />
		</>
	);
}
