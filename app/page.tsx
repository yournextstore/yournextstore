import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { GiftCollections } from "@/components/sections/gift-collections";
import { Hero } from "@/components/sections/hero";
import { MarqueeBadge } from "@/components/sections/marquee-badge";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { RecipesCallout } from "@/components/sections/recipes-callout";
import { Story } from "@/components/sections/story";
import { Testimonials } from "@/components/sections/testimonials";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
			<div className="text-center mb-14">
				<div className="h-3 w-32 bg-[var(--secondary)] rounded mx-auto animate-pulse" />
				<div className="mt-4 h-10 w-72 bg-[var(--secondary)] rounded mx-auto animate-pulse" />
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-[var(--secondary)] rounded-full animate-pulse" />
						<div className="mt-4 mx-auto h-4 w-2/3 bg-[var(--secondary)] rounded animate-pulse" />
						<div className="mt-2 mx-auto h-3 w-1/3 bg-[var(--secondary)] rounded animate-pulse" />
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
			<MarqueeBadge />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Cookies Fresh from the Oven" limit={8} />
			</Suspense>
			<GiftCollections />
			<Story />
			<RecipesCallout />
			<About />
			<Testimonials />
			<Newsletter />
		</>
	);
}
