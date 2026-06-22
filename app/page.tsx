import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { FaqYellow } from "@/components/sections/faq-yellow";
import { FlavorCards } from "@/components/sections/flavor-cards";
import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";
import { PromoBanner } from "@/components/sections/promo-banner";

function ProductGridSkeleton() {
	return (
		<section className="bg-[var(--tizz-cream)] py-16 sm:py-24">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-end justify-between mb-10">
					<div>
						<div className="h-3 w-32 bg-[var(--tizz-orange)]/30 rounded mb-3 animate-pulse" />
						<div className="h-12 w-72 bg-[var(--tizz-deep)]/10 rounded animate-pulse" />
					</div>
				</div>
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
					{Array.from({ length: 8 }).map((_, i) => (
						<div key={`skeleton-${i}`}>
							<div className="aspect-square bg-[var(--tizz-deep)]/10 rounded-[2rem] mb-3 animate-pulse" />
							<div className="h-5 w-3/4 bg-[var(--tizz-deep)]/10 rounded animate-pulse" />
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
			<FlavorCards />
			<Marquee />
			<About />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Bestsellers" overline="Top of the charts" limit={8} />
			</Suspense>
			<PromoBanner />
			<PressStrip />
			<FaqYellow />
			<Newsletter />
		</>
	);
}
