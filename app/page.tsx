import { Suspense } from "react";
import { BlogSection } from "@/components/sections/blog-section";
import { BrandMarquee } from "@/components/sections/brand-marquee";
import { CollectionCarousel } from "@/components/sections/collection-carousel";
import { ContactSection } from "@/components/sections/contact-section";
import { FeatureSection } from "@/components/sections/feature-section";
import { Hero } from "@/components/sections/hero";
import { ProductGrid } from "@/components/sections/product-grid";
import { SaleBanner } from "@/components/sections/sale-banner";
import { ShopTheLook } from "@/components/sections/shop-the-look";
import { TechSection } from "@/components/sections/tech-section";
import { TestimonialSection } from "@/components/sections/testimonial-section";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="flex items-end justify-between mb-12">
				<div>
					<div className="h-4 w-24 bg-secondary rounded animate-pulse" />
					<div className="mt-3 h-8 w-48 bg-secondary rounded animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-secondary rounded-2xl mb-3 animate-pulse" />
						<div className="space-y-2">
							<div className="h-4 w-3/4 bg-secondary rounded animate-pulse" />
							<div className="h-4 w-1/4 bg-secondary rounded animate-pulse" />
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
			{/* 1. Hero - lifestyle image + "Minimal Aesthetic" text */}
			<Hero />

			{/* 2. Feature Section - "Perfect for drinks" with feature icons */}
			<FeatureSection />

			{/* 3. Tech Section - 24h/12h insulation specs */}
			<TechSection />

			{/* 4. Collection Carousel - horizontal scrolling categories */}
			<CollectionCarousel />

			{/* 5. Shop the Look - full-width lifestyle image */}
			<ShopTheLook />

			{/* 6. Sale Banner - "Buy one get one" with countdown */}
			<SaleBanner />

			{/* 7. Brand Values Marquee - scrolling brand pillars */}
			<BrandMarquee />

			{/* 8. Featured Products - 4-column product grid */}
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid
					title="We can't play favorites. Shop all our products"
					description="Enjoy everything from bubble tea and iced matcha to hot coffee and cocktails"
					limit={8}
				/>
			</Suspense>

			{/* 9. Testimonial Section */}
			<TestimonialSection />

			{/* 10. Blog Section */}
			<BlogSection />

			{/* 11. Contact / Newsletter */}
			<ContactSection />
		</main>
	);
}
