import type { Metadata } from "next";
import { Suspense } from "react";
import { AboutSection } from "@/components/sections/about-section";
import { CollectionsGrid } from "@/components/sections/collections-grid";
import { CountdownSale } from "@/components/sections/countdown-sale";
import { FeatureBadges } from "@/components/sections/feature-badges";
import { FunctionFashion } from "@/components/sections/function-fashion";
import { Hero } from "@/components/sections/hero";
import { ImageMarquee } from "@/components/sections/image-marquee";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { ShopGender } from "@/components/sections/shop-gender";
import { ShopTheLook } from "@/components/sections/shop-the-look";
import { Testimonials } from "@/components/sections/testimonials";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main>
			{/* 1. Hero — 3-panel slideshow */}
			<Hero />

			{/* 2. Bestsellers — 5-column product grid */}
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Bestsellers" limit={10} columns={5} />

			{/* 3. Function & Fashion — dark banner */}
			<FunctionFashion />

			{/* 4. Shop Men / Shop Women — split promo */}
			<ShopGender />

			{/* 5. Shop The Look — image + product cards */}
			<Suspense>
				<ShopTheLook />
			</Suspense>

			{/* 6. Get to Know Us — about section */}
			<AboutSection />

			{/* 7. Testimonials */}
			<Testimonials />

			{/* 8. New Arrivals — smaller product grid */}
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="New Arrivals" limit={3} columns={3} viewAllHref="/products" />

			{/* 9. Final Sale — countdown timer */}
			<CountdownSale />

			{/* 10. Collections — grid */}
			<Suspense>
				<CollectionsGrid />
			</Suspense>

			{/* 11. Image Gallery Marquee */}
			<ImageMarquee />

			{/* 12. Feature Badges — delivery, dispatch, returns */}
			<FeatureBadges />

			{/* 13. Newsletter */}
			<Newsletter />
		</main>
	);
}
