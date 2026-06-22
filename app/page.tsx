import type { Metadata } from "next";
import { BannerGrid } from "@/components/sections/banner-grid";
import { CategoryShowcase } from "@/components/sections/category-showcase";
import { Hero } from "@/components/sections/hero";
import { ProductGrid } from "@/components/sections/product-grid";
import { PromoBanner } from "@/components/sections/promo-banner";
import { ServiceFeatures } from "@/components/sections/service-features";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main>
			<Hero />
			<BannerGrid />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="What We Offer" description="New arrivals and best sellers" limit={8} />
			<PromoBanner />
			<CategoryShowcase />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Popular Products" description="Top-rated parts and accessories" limit={8} />
			<ServiceFeatures />
		</main>
	);
}
