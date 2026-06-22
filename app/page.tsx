import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Editorial } from "@/components/sections/editorial";
import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20 lg:py-24">
			<div className="flex items-end justify-between mb-10 border-b border-[color:var(--border)] pb-8">
				<div>
					<div className="h-3 w-24 bg-secondary rounded animate-pulse" />
					<div className="mt-3 h-10 w-72 bg-secondary rounded animate-pulse" />
					<div className="mt-4 h-5 w-96 bg-secondary rounded animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-14">
				{Array.from({ length: 8 }).map((_, i) => (
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
			<Marquee />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="The catalogue" limit={8} eyebrow="N° 01 — Featured" />
			</Suspense>
			<Suspense>
				<Editorial />
			</Suspense>
			<About />
			<Newsletter />
		</>
	);
}
