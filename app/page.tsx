import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogSection } from "@/components/sections/blog-section";
import { DealBanners } from "@/components/sections/deal-banners";
import { FeaturedSidebar } from "@/components/sections/featured-sidebar";
import { Hero } from "@/components/sections/hero";
import { ProductGrid } from "@/components/sections/product-grid";
import { PromoBanners } from "@/components/sections/promo-banners";
import { TrustBar } from "@/components/sections/trust-bar";

function SectionSkeleton() {
	return <div className="h-64 bg-secondary/30 animate-pulse" />;
}

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main>
			<Hero />
			<PromoBanners />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="WHAT WE OFFER" description="New Arrivals & Featured Products" limit={8} />
			<DealBanners />
			<TrustBar />
			<Suspense fallback={<SectionSkeleton />}>
				<FeaturedSidebar />
			</Suspense>
			<BlogSection />
		</main>
	);
}
