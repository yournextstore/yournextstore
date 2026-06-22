import { Suspense } from "react";
import { BabyHeaven } from "@/components/sections/baby-heaven";
import { BestSellers } from "@/components/sections/best-sellers";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { PromoBanner } from "@/components/sections/promo-banner";
import { WhyBest } from "@/components/sections/why-best";

function ProductHubSkeleton() {
	return (
		<section className="bg-cream/60">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="h-9 w-56 bg-brand/10 rounded animate-pulse mb-10" />
				<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={`skeleton-${i}`}>
							<div className="aspect-square bg-brand/10 rounded-2xl mb-3 animate-pulse" />
							<div className="h-4 w-3/4 bg-brand/10 rounded animate-pulse" />
							<div className="mt-2 h-4 w-1/3 bg-brand/10 rounded animate-pulse" />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

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

export default function Home() {
	return (
		<main className="bg-background">
			<Hero />
			<PromoBanner />
			<Suspense fallback={<ProductHubSkeleton />}>
				<ProductGrid
					variant="hub"
					title="Product Hub"
					description="Hand-curated favourites this season — from soft swaddles to clever strollers."
					limit={8}
				/>
			</Suspense>
			<WhyBest />
			<Suspense fallback={<BestSellersSkeleton />}>
				<BestSellers />
			</Suspense>
			<BabyHeaven />
			<Newsletter />
		</main>
	);
}
