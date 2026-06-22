import type { Metadata } from "next";
import { Suspense } from "react";
import { BabyHeaven } from "@/components/sections/baby-heaven";
import { BestSellers } from "@/components/sections/best-sellers";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { PromoBanner } from "@/components/sections/promo-banner";
import { WhyBest } from "@/components/sections/why-best";

function BestSellersSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
			<div className="h-9 w-64 bg-secondary rounded animate-pulse mb-10" />
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				<div className="lg:col-span-5 min-h-[460px] bg-brand/20 rounded-3xl animate-pulse" />
				<div className="lg:col-span-7 grid grid-cols-2 gap-5 sm:gap-6">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={`bs-skeleton-${i}`} className="aspect-square bg-secondary rounded-2xl animate-pulse" />
					))}
				</div>
			</div>
		</section>
	);
}

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main className="bg-background">
			<Hero />
			<PromoBanner />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid
				variant="hub"
				title="Product Hub"
				description="Hand-curated favourites this season — from soft swaddles to clever strollers."
				limit={8}
			/>
			<WhyBest />
			<Suspense fallback={<BestSellersSkeleton />}>
				<BestSellers />
			</Suspense>
			<BabyHeaven />
			<Newsletter />
		</main>
	);
}
