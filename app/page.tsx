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

function ProductGridSkeleton() {
	return (
		<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
			<div className="flex items-end justify-between mb-10">
				<div>
					<div className="h-8 w-48 bg-secondary animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
				{Array.from({ length: 10 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[3/4] bg-secondary mb-3 animate-pulse" />
						<div className="space-y-1">
							<div className="h-4 w-3/4 bg-secondary animate-pulse" />
							<div className="h-4 w-1/3 bg-secondary animate-pulse" />
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
			{/* 1. Hero — 3-panel slideshow */}
			<Hero />

			{/* 2. Bestsellers — 5-column product grid */}
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Bestsellers" limit={10} columns={5} />
			</Suspense>

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
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="New Arrivals" limit={3} columns={3} viewAllHref="/products" />
			</Suspense>

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
