import { Suspense } from "react";
import { AboutSection } from "@/components/sections/about-section";
import { BestSellers } from "@/components/sections/best-sellers";
import { FeatureStrip } from "@/components/sections/feature-strip";
import { Hero } from "@/components/sections/hero";
import { NewArrivals } from "@/components/sections/new-arrivals";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="text-center mb-12">
				<div className="h-4 w-32 bg-primary/20 rounded animate-pulse mx-auto mb-2" />
				<div className="h-8 w-48 bg-muted rounded animate-pulse mx-auto mb-4" />
				<div className="h-5 w-64 bg-muted rounded animate-pulse mx-auto" />
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={`skeleton-${i}`} className="bg-card rounded-xl p-4 border border-border">
						<div className="aspect-square bg-muted rounded-lg mb-4 animate-pulse" />
						<div className="space-y-2">
							<div className="h-4 w-20 bg-muted rounded animate-pulse mx-auto" />
							<div className="h-5 w-3/4 bg-muted rounded animate-pulse mx-auto" />
							<div className="h-5 w-1/4 bg-muted rounded animate-pulse mx-auto" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

function NewArrivalsSkeletons() {
	return (
		<section className="py-20 bg-dark-accent border-y border-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-12">
					<div className="h-4 w-24 bg-primary/20 rounded animate-pulse mb-2" />
					<div className="h-8 w-40 bg-muted rounded animate-pulse" />
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							key={`skeleton-${i}`}
							className="bg-background-dark rounded-xl overflow-hidden border border-border"
						>
							<div className="h-64 bg-muted animate-pulse" />
							<div className="p-6 space-y-3">
								<div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
								<div className="h-4 w-full bg-muted rounded animate-pulse" />
								<div className="flex justify-between items-center">
									<div className="h-6 w-16 bg-muted rounded animate-pulse" />
									<div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
								</div>
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
		<main>
			<Hero />
			<FeatureStrip />
			<AboutSection />
			<Suspense fallback={<ProductGridSkeleton />}>
				<BestSellers limit={4} />
			</Suspense>
			<Suspense fallback={<NewArrivalsSkeletons />}>
				<NewArrivals limit={3} />
			</Suspense>
		</main>
	);
}
