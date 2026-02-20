import { Suspense } from "react";
import { BrandStatement } from "@/components/sections/brand-statement";
import { CollectionBanner } from "@/components/sections/collection-banner";
import { ExploreCollections } from "@/components/sections/explore-collections";
import { Hero } from "@/components/sections/hero";
import { ImageGalleryGrid } from "@/components/sections/image-gallery-grid";
import { MarqueeBanner } from "@/components/sections/marquee-banner";
import { NewsletterValues } from "@/components/sections/newsletter-values";
import { PopularCategories } from "@/components/sections/popular-categories";
import { ProductGrid } from "@/components/sections/product-grid";
import { ShopByCategory } from "@/components/sections/shop-by-category";
import { Testimonials } from "@/components/sections/testimonials";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="flex items-end justify-between mb-10">
				<div>
					<div className="h-8 w-48 bg-secondary animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[3/4] bg-secondary mb-3 animate-pulse" />
						<div className="space-y-2">
							<div className="h-4 w-3/4 bg-secondary animate-pulse" />
							<div className="h-4 w-1/4 bg-secondary animate-pulse" />
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
			{/* 1. Hero Slideshow */}
			<Hero />

			{/* 2. Shop by Category */}
			<ShopByCategory />

			{/* 3. Brand Statement */}
			<BrandStatement text="Your Next Store — a prominent Scandinavian streetwear brand, continuing to embrace evolving trends while staying true to its core identity and heritage." />

			{/* 4. Sale Marquee Banner */}
			<MarqueeBanner />

			{/* 5. Featured Products */}
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Featured Products" limit={8} />
			</Suspense>

			{/* 6. Explore Collections */}
			<Suspense>
				<ExploreCollections />
			</Suspense>

			{/* 7. Popular Categories */}
			<PopularCategories />

			{/* 8. Second Brand Statement */}
			<BrandStatement text="Situated in Jutland, Denmark, Your Next Store has been making conscious streetwear based on a slow fashion principle since 1995." />

			{/* 9. On Sale Products */}
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="On Sale!" limit={8} />
			</Suspense>

			{/* 10. Collection Banner */}
			<CollectionBanner />

			{/* 11. Goes Well Together (another product grid) */}
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Goes Well Together" description="MIX & MATCH" limit={8} viewAllHref="/products" />
			</Suspense>

			{/* 12. Testimonials */}
			<Testimonials />

			{/* 13. Newsletter + Values */}
			<NewsletterValues />

			{/* 14. Image Gallery Grid */}
			<ImageGalleryGrid />
		</main>
	);
}
