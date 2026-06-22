import type { Metadata } from "next";
import { Suspense } from "react";
import { AthleteFeature } from "@/components/sections/athlete-feature";
import { CollectionGrid } from "@/components/sections/collection-grid";
import { CollectionPicks } from "@/components/sections/collection-picks";
import { GiftCards } from "@/components/sections/gift-cards";
import { Hero } from "@/components/sections/hero";
import { Journal } from "@/components/sections/journal";
import { ProductGrid } from "@/components/sections/product-grid";
import { PromoBanner } from "@/components/sections/promo-banner";
import { Testimonials } from "@/components/sections/testimonials";
import { VideoBanner } from "@/components/sections/video-banner";

function SectionSkeleton() {
	return <div className="h-64 bg-secondary/30 animate-pulse" />;
}

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main>
			{/* 1. Hero slideshow */}
			<Hero />

			{/* 2. Top picks — collection cards */}
			<Suspense fallback={<SectionSkeleton />}>
				<CollectionPicks />
			</Suspense>

			{/* 3. Best selling products grid */}
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Best selling" limit={8} />

			{/* 4. Summer wear promo banner */}
			<PromoBanner />

			{/* 5. Into the wild — video/cinematic banner */}
			<VideoBanner />

			{/* 6. Gift cards section */}
			<GiftCards />

			{/* 7. Collection grid */}
			<Suspense fallback={<SectionSkeleton />}>
				<CollectionGrid />
			</Suspense>

			{/* 8. Testimonials */}
			<Testimonials />

			{/* 9. Just restocked — another product grid */}
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Just restocked" limit={4} />

			{/* 10. Athlete feature */}
			<AthleteFeature />

			{/* 11. From the journal */}
			<Journal />
		</main>
	);
}
