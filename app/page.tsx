import type { Metadata } from "next";
import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { BenefitsBar } from "@/components/sections/benefits-bar";
import { BundleSection } from "@/components/sections/bundle-section";
import { CollectionsCarousel } from "@/components/sections/collections-carousel";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Hero } from "@/components/sections/hero";
import { HotThisWeek } from "@/components/sections/hot-this-week";
import { Newsletter } from "@/components/sections/newsletter";
import { PressSection } from "@/components/sections/press-section";
import { ProductGrid } from "@/components/sections/product-grid";
import { TextWithImages } from "@/components/sections/text-with-images";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main>
			{/* 1. Hero Slideshow */}
			<Hero />

			{/* 2. Product Grid - What's Hot */}
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="What's hot" limit={8} columns={4} />

			{/* 3. Text with Images - "Make you look and feel glowy" */}
			<TextWithImages />

			{/* 4. Collections Carousel */}
			<Suspense>
				<CollectionsCarousel />
			</Suspense>

			{/* 5. Bundle Section */}
			<BundleSection />

			{/* 6. Press Section */}
			<PressSection />

			{/* 7. Hot This Week Cards */}
			<HotThisWeek />

			{/* 8. Benefits Bar */}
			<BenefitsBar />

			{/* 9. CTA Banner */}
			<CtaBanner />

			{/* 10. More Products */}
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Best Sellers" limit={4} columns={4} viewAllHref="/products" />
			<About />
			<Newsletter />
		</main>
	);
}
