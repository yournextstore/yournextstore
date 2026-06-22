import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { TrustStrip } from "@/components/sections/trust-strip";

function ProductGridSkeleton() {
	return (
		<section className="bg-brand-cream">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="flex flex-col items-center text-center mb-12">
					<div className="h-3 w-24 bg-brand-coral/30 rounded animate-pulse" />
					<div className="mt-3 h-10 w-72 bg-brand-ink/10 rounded animate-pulse" />
					<div className="mt-3 h-4 w-64 bg-brand-ink/10 rounded animate-pulse" />
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={`skeleton-${i}`}>
							<div className="aspect-square bg-white/60 rounded-[28px] mb-4 animate-pulse" />
							<div className="space-y-2 px-1">
								<div className="h-5 w-3/4 bg-brand-ink/10 rounded animate-pulse" />
								<div className="h-5 w-1/4 bg-brand-ink/10 rounded animate-pulse" />
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
			<TrustStrip />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Enjoy Your Next Store" limit={6} />
			</Suspense>
			<About />
			<Newsletter />
		</>
	);
}
