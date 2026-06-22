import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { AuthorSpotlight } from "@/components/sections/author-spotlight";
import { EditorialCards } from "@/components/sections/editorial-cards";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="bg-cream-dark border-y-2 border-ink py-16 sm:py-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
				<div className="h-4 w-32 bg-foreground/10 rounded animate-pulse mb-3" />
				<div className="h-10 w-72 bg-foreground/10 rounded animate-pulse" />
			</div>
			<div className="flex gap-6 px-4 sm:px-6 lg:px-8 overflow-hidden">
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={`skeleton-${i}`} className="w-[260px] sm:w-[300px] flex-none">
						<div className="aspect-square bg-foreground/10 rounded-2xl mb-3 animate-pulse" />
						<div className="h-4 w-3/4 bg-foreground/10 rounded animate-pulse mb-2" />
						<div className="h-4 w-1/3 bg-foreground/10 rounded animate-pulse" />
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
			<About />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid limit={8} variant="shelf" />
			</Suspense>
			<EditorialCards />
			<PressStrip />
			<AuthorSpotlight />
			<Newsletter />
		</>
	);
}
