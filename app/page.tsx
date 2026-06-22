import { Suspense } from "react";
import { Hero } from "@/components/sections/hero";
import { HomeFAQ } from "@/components/sections/home-faq";
import { Marquee } from "@/components/sections/marquee";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
			<div className="mb-12 flex items-end justify-between">
				<div>
					<div className="h-8 w-48 animate-pulse rounded bg-[#EADBC5]" />
					<div className="mt-2 h-5 w-64 animate-pulse rounded bg-[#EADBC5]" />
				</div>
			</div>
			<div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="mb-4 aspect-square animate-pulse rounded-2xl bg-[#EADBC5]" />
						<div className="space-y-2">
							<div className="h-5 w-3/4 animate-pulse rounded bg-[#EADBC5]" />
							<div className="h-5 w-1/4 animate-pulse rounded bg-[#EADBC5]" />
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
			<Marquee />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Our wholesome lineup" description="Family-roasted, in small batches." limit={8} />
			</Suspense>
			<HomeFAQ />
		</main>
	);
}
