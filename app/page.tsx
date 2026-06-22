import { Suspense } from "react";
import { Bundles } from "@/components/sections/bundles";
import { Editorial } from "@/components/sections/editorial";
import { FAQ } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { Macros } from "@/components/sections/macros";
import { Newsletter } from "@/components/sections/newsletter";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";
import { ReviewsWall } from "@/components/sections/reviews-wall";

function HeroSkeleton() {
	return (
		<section className="bg-black h-[80vh] flex items-center justify-center">
			<div className="text-white/30 font-display uppercase tracking-[0.2em] text-xs">Loading…</div>
		</section>
	);
}

function ProductGridSkeleton() {
	return (
		<section className="bg-black">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="mb-14">
					<div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
					<div className="mt-4 h-10 w-72 bg-white/10 rounded animate-pulse" />
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{Array.from({ length: 8 }).map((_, i) => (
						<div key={`skeleton-${i}`}>
							<div className="aspect-square bg-white/[0.04] rounded-3xl animate-pulse" />
							<div className="mt-4 h-4 w-3/4 bg-white/10 rounded animate-pulse" />
							<div className="mt-2 h-4 w-1/4 bg-white/10 rounded animate-pulse" />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<main className="bg-black">
			<Suspense fallback={<HeroSkeleton />}>
				<Hero />
			</Suspense>
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Shop the flavors" limit={8} />
			</Suspense>
			<Macros />
			<Editorial />
			<ReviewsWall />
			<Press />
			<Bundles />
			<FAQ />
			<Newsletter />
		</main>
	);
}
