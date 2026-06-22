import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { FindUs } from "@/components/sections/find-us";
import { FlavorLineup } from "@/components/sections/flavor-lineup";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";
import { SocialGrid } from "@/components/sections/social-grid";
import { Ticker } from "@/components/sections/ticker";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
			<div className="flex items-end justify-between mb-12">
				<div>
					<div className="h-4 w-32 bg-fizz-yellow rounded animate-pulse" />
					<div className="mt-3 h-10 w-64 bg-fizz-aqua/40 rounded animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-fizz-aqua/40 rounded-[1.75rem] mb-4 animate-pulse" />
						<div className="space-y-2 px-1">
							<div className="h-5 w-3/4 bg-fizz-yellow-soft rounded animate-pulse" />
							<div className="h-5 w-1/4 bg-fizz-yellow-soft rounded animate-pulse" />
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
			<Ticker />
			<FlavorLineup />
			<About />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Pour Yourself One" eyebrow="Shop The Bar" limit={6} />
			</Suspense>
			<PressStrip />
			<FindUs />
			<SocialGrid />
			<Newsletter />
		</>
	);
}
