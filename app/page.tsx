import type { Metadata } from "next";
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

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

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
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Featured Products" limit={8} />

			{/* 6. Explore Collections */}
			<Suspense>
				<ExploreCollections />
			</Suspense>

			{/* 7. Popular Categories */}
			<PopularCategories />

			{/* 8. Second Brand Statement */}
			<BrandStatement text="Situated in Jutland, Denmark, Your Next Store has been making conscious streetwear based on a slow fashion principle since 1995." />

			{/* 9. On Sale Products */}
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="On Sale!" limit={8} />

			{/* 10. Collection Banner */}
			<CollectionBanner />

			{/* 11. Goes Well Together (another product grid) */}
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Goes Well Together" description="MIX & MATCH" limit={8} viewAllHref="/products" />

			{/* 12. Testimonials */}
			<Testimonials />

			{/* 13. Newsletter + Values */}
			<NewsletterValues />

			{/* 14. Image Gallery Grid */}
			<ImageGalleryGrid />
		</main>
	);
}
