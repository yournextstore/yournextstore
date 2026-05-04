import { Suspense } from "react";
import { BlogSection } from "@/components/sections/blog-section";
import { DealBanners } from "@/components/sections/deal-banners";
import { FeaturedSidebar } from "@/components/sections/featured-sidebar";
import { Hero } from "@/components/sections/hero";
import { ProductGrid } from "@/components/sections/product-grid";
import { PromoBanners } from "@/components/sections/promo-banners";
import { TrustBar } from "@/components/sections/trust-bar";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
			<div className="flex items-end justify-between mb-8">
				<div>
					<div className="h-8 w-48 bg-secondary animate-pulse" />
					<div className="mt-2 h-5 w-64 bg-secondary animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`} className="border border-border">
						<div className="aspect-square bg-secondary animate-pulse" />
						<div className="p-3 space-y-2">
							<div className="h-4 w-3/4 bg-secondary animate-pulse" />
							<div className="h-4 w-1/4 bg-secondary animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

function SectionSkeleton() {
	return <div className="h-64 bg-secondary/30 animate-pulse" />;
}

export default function Home() {
	return (
		<main>
			<Hero />
			<PromoBanners />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="WHAT WE OFFER" description="New Arrivals & Featured Products" limit={8} />
			</Suspense>
			<DealBanners />
			<TrustBar />
			<Suspense fallback={<SectionSkeleton />}>
				<FeaturedSidebar />
			</Suspense>
			<BlogSection />
		</main>
	);
}
