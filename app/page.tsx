import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Founders } from "@/components/sections/founders";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";
import { ValueProps } from "@/components/sections/value-props";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
			<div className="text-center mb-14">
				<div className="h-4 w-24 bg-[var(--cream-deep)] rounded mx-auto animate-pulse" />
				<div className="mt-4 h-10 w-72 bg-[var(--cream-deep)] rounded mx-auto animate-pulse" />
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-[var(--cream-deep)] rounded-[28px] mb-4 animate-pulse" />
						<div className="space-y-2">
							<div className="h-5 w-3/4 bg-[var(--cream-deep)] rounded animate-pulse" />
							<div className="h-5 w-1/4 bg-[var(--cream-deep)] rounded animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<main className="bg-cream-paper">
			<Hero />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Pick Your Flavor" limit={6} />
			</Suspense>
			<About />
			<ValueProps />
			<Press />
			<Founders />
			<Newsletter />
		</main>
	);
}
