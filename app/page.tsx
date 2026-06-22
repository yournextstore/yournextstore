import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogSection } from "@/components/sections/blog-section";
import { BrandLogos } from "@/components/sections/brand-logos";
import { CategoryCards } from "@/components/sections/category-cards";
import { Hero } from "@/components/sections/hero";
import { InstagramSection } from "@/components/sections/instagram-section";
import { ProductGrid } from "@/components/sections/product-grid";
import { PromoBanners } from "@/components/sections/promo-banners";

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

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main>
			<Hero />

			<Suspense fallback={<CategorySkeleton />}>
				<CategoryCards />
			</Suspense>

			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="New Products" limit={8} />

			<PromoBanners />

			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Trending Now" limit={8} />

			<BrandLogos />

			<BlogSection />

			<InstagramSection />
		</main>
	);
}
