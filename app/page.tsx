import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { Journal } from "@/components/sections/journal";
import { Marquee } from "@/components/sections/marquee";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { Testimonials } from "@/components/sections/testimonials";

function ProductGridSkeleton() {
	return (
		<section className="mush-cream-gradient">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 lg:gap-16">
					<div>
						<div className="h-16 w-40 bg-[color:var(--color-mush-cream-deep)] rounded animate-pulse" />
						<div className="mt-8 space-y-3">
							{Array.from({ length: 5 }).map((_, i) => (
								<div
									key={`f-skel-${i}`}
									className="h-10 w-44 rounded-full bg-[color:var(--color-mush-cream-deep)] animate-pulse"
								/>
							))}
						</div>
					</div>
					<div className="flex gap-6 overflow-hidden">
						{Array.from({ length: 4 }).map((_, i) => (
							<div key={`p-skel-${i}`} className="w-[280px] shrink-0">
								<div className="aspect-[4/5] rounded-2xl bg-[color:var(--color-mush-cream-deep)] animate-pulse" />
								<div className="mt-4 h-4 w-2/3 mx-auto bg-[color:var(--color-mush-cream-deep)] rounded animate-pulse" />
							</div>
						))}
					</div>
				</div>
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
				<ProductGrid title="Explore the Apothecary" limit={8} />
			</Suspense>
			<About />
			<Testimonials />
			<Journal />
			<Newsletter />
		</>
	);
}
