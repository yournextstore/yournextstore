import type { Metadata } from "next";
import { Suspense } from "react";
import { BigDealsBanner } from "@/components/sections/big-deals-banner";
import { BrandBanner } from "@/components/sections/brand-banner";
import { Hero } from "@/components/sections/hero";
import { InstagramGrid } from "@/components/sections/instagram-grid";
import { ProductGrid } from "@/components/sections/product-grid";
import { ScrollingMarquee } from "@/components/sections/scrolling-marquee";
import { ShopTheLook } from "@/components/sections/shop-the-look";
import { Testimonials } from "@/components/sections/testimonials";
import { TopCollections } from "@/components/sections/top-collections";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main>
			<Hero />
			<Suspense>
				<TopCollections />
			</Suspense>
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Best Selling" limit={8} />
			<ShopTheLook outfitImage="/scraped-3.jpg" outfitAlt="Shop the look outfit 1" />
			<BigDealsBanner />
			<ShopTheLook outfitImage="/scraped-4.jpg" outfitAlt="Shop the look outfit 2" flipped />
			<ScrollingMarquee />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid
				title="Trending Outfits"
				description="Unmatched design—superior performance and customer satisfaction in one."
				limit={8}
				showViewAll={false}
			/>
			<Testimonials />
			<BrandBanner />
			<InstagramGrid />
		</main>
	);
}
