import type { Metadata } from "next";
import { Suspense } from "react";
import { CollectionsGrid } from "@/components/sections/collections-grid";
import { FeaturedProduct } from "@/components/sections/featured-product";
import { Hero } from "@/components/sections/hero";
import { ImageMosaic } from "@/components/sections/image-mosaic";
import { InfoColumns } from "@/components/sections/info-columns";
import { LookbookSection } from "@/components/sections/lookbook-section";
import { MarqueeBanner } from "@/components/sections/marquee-banner";
import { MissionBanner } from "@/components/sections/mission-banner";
import { ProductGrid } from "@/components/sections/product-grid";
import { Testimonials } from "@/components/sections/testimonials";

function SectionSkeleton() {
	return <div className="h-64 bg-secondary animate-pulse" />;
}

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main>
			{/* 1. Hero Slideshow */}
			<Hero />

			{/* 2. Marquee Banner */}
			<MarqueeBanner />

			{/* 3. New Arrivals Product Grid */}
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="New Arrivals" limit={9} />

			{/* 4. Shop Collections */}
			<Suspense fallback={<SectionSkeleton />}>
				<CollectionsGrid />
			</Suspense>

			{/* 5. Second Product Grid */}
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Featured" limit={8} showViewAll={false} />

			{/* 6. Mission Banner */}
			<MissionBanner />

			{/* 7. Shop by Collection (Lookbook) */}
			<Suspense fallback={<SectionSkeleton />}>
				<LookbookSection />
			</Suspense>

			{/* 8. Testimonials */}
			<Testimonials />

			{/* 9. Featured Product */}
			<Suspense fallback={<SectionSkeleton />}>
				<FeaturedProduct />
			</Suspense>

			{/* 10. Image Mosaic */}
			<ImageMosaic />

			{/* 11. Info Columns (Shipping/Delivery/Returns) */}
			<InfoColumns />
		</main>
	);
}
