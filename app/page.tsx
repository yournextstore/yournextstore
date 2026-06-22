import { Suspense } from "react";
import { Benefits } from "@/components/sections/benefits";
import { Hero } from "@/components/sections/hero";
import { Journal } from "@/components/sections/journal";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { UgcStrip } from "@/components/sections/ugc-strip";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
			<div className="flex flex-col items-center mb-14">
				<div className="h-3 w-32 bg-cream rounded animate-pulse" />
				<div className="mt-4 h-10 w-72 bg-cream rounded animate-pulse" />
				<div className="mt-3 h-5 w-96 bg-cream rounded animate-pulse" />
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12 sm:gap-x-8">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[4/5] bg-cream mb-4 animate-pulse" />
						<div className="space-y-2">
							<div className="h-4 w-3/4 bg-cream rounded animate-pulse" />
							<div className="h-4 w-1/4 bg-cream rounded animate-pulse" />
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
			<Benefits />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="The Bestsellers" limit={8} />
			</Suspense>
			<Journal />
			<UgcStrip />
			<Newsletter />
		</>
	);
}
