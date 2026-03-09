import { Suspense } from "react";
import { BlogSection } from "@/components/sections/blog-section";
import { BrandLogos } from "@/components/sections/brand-logos";
import { CategoryCards } from "@/components/sections/category-cards";
import { Hero } from "@/components/sections/hero";
import { InstagramSection } from "@/components/sections/instagram-section";
import { ProductGrid } from "@/components/sections/product-grid";
import { PromoBanners } from "@/components/sections/promo-banners";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
			<div className="flex items-center justify-between mb-8">
				<div className="h-5 w-48 bg-secondary animate-pulse" />
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[3/4] bg-secondary mb-3 animate-pulse" />
						<div className="space-y-2">
							<div className="h-3 w-3/4 bg-secondary animate-pulse" />
							<div className="h-3 w-1/4 bg-secondary animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

function CategorySkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={`cat-skeleton-${i}`}>
						<div className="aspect-[3/4] bg-secondary mb-4 animate-pulse" />
						<div className="h-4 w-24 bg-secondary animate-pulse mb-3" />
						<div className="space-y-2">
							<div className="h-3 w-20 bg-secondary animate-pulse" />
							<div className="h-3 w-28 bg-secondary animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<main>
			<Hero />

			<Suspense fallback={<CategorySkeleton />}>
				<CategoryCards />
			</Suspense>

			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="New Products" limit={8} />
			</Suspense>

			<PromoBanners />

			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Trending Now" limit={8} />
			</Suspense>

			<BrandLogos />

			<BlogSection />

			<InstagramSection />
		</main>
	);
}
