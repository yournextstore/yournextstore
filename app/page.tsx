import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Diaries } from "@/components/sections/diaries";
import { Hero } from "@/components/sections/hero";
import { Ingredients } from "@/components/sections/ingredients";
import { Newsletter } from "@/components/sections/newsletter";
import { PressMarquee } from "@/components/sections/press-marquee";
import { ProductGrid } from "@/components/sections/product-grid";
import { TaglineStrip } from "@/components/sections/tagline-strip";

function ProductGridSkeleton() {
	return (
		<section className="bg-[var(--yns-paper)]">
			<div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="mb-12 sm:mb-16">
					<div className="h-3 w-32 bg-[var(--yns-red)]/40 rounded animate-pulse mb-4" />
					<div className="h-16 w-72 bg-[var(--yns-ink)]/10 rounded animate-pulse" />
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={`skeleton-${i}`}>
							<div className="aspect-[4/5] bg-[var(--yns-cream)] mb-5 animate-pulse" />
							<div className="space-y-2">
								<div className="h-4 w-3/4 bg-[var(--yns-ink)]/10 animate-pulse" />
								<div className="h-4 w-1/4 bg-[var(--yns-ink)]/10 animate-pulse" />
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
			<TaglineStrip />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid limit={3} />
			</Suspense>
			<About />
			<PressMarquee />
			<Diaries />
			<Ingredients />
			<Newsletter />
		</>
	);
}
