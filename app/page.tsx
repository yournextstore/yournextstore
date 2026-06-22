import type { Metadata } from "next";
import { Suspense } from "react";
import { BrandStory } from "@/components/sections/brand-story";
import { CoffeePromo } from "@/components/sections/coffee-promo";
import { CollectionList } from "@/components/sections/collection-list";
import { DeskDeclutter } from "@/components/sections/desk-declutter";
import { FullWidthBanner } from "@/components/sections/full-width-banner";
import { Hero } from "@/components/sections/hero";
import { LogoBar } from "@/components/sections/logo-bar";
import { ProductGrid } from "@/components/sections/product-grid";
import { PromoBar } from "@/components/sections/promo-bar";
import { Testimonials } from "@/components/sections/testimonials";
import { TextWithImage } from "@/components/sections/text-with-image";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main>
			{/* 1. Hero - full width desk image with centered heading */}
			<Hero />

			{/* 2. Coffee making essentials - image grid + text */}
			<CoffeePromo />

			{/* 3. Testimonials - 4-column review quotes */}
			<Testimonials />

			{/* 4. Logo bar - brand logos */}
			<LogoBar />

			{/* 5. Text with image - "Everything within reach" */}
			<TextWithImage />

			{/* 6. Collection list - 3 collection cards */}
			<Suspense>
				<CollectionList />
			</Suspense>

			{/* 7. Brand story - about section with images */}
			<BrandStory />

			{/* 8. Full width banner image */}
			<FullWidthBanner />

			{/* 9. Desk decluttering - image + text */}
			<DeskDeclutter />

			{/* 10. Product grid - featured products */}
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Homewares" description="Browse our curated collection" limit={6} />

			{/* 11. Promo bar - shipping, sustainable, locally made */}
			<PromoBar />
		</main>
	);
}
