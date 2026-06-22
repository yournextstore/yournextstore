import type { Metadata } from "next";
import { Suspense } from "react";
import { CategoriesGrid } from "@/components/sections/categories-grid";
import { DefineBeauty } from "@/components/sections/define-beauty";
import { GoodSkinDay } from "@/components/sections/good-skin-day";
import { Hero } from "@/components/sections/hero";
import { HydrateSkin } from "@/components/sections/hydrate-skin";
import { Lookbook } from "@/components/sections/lookbook";
import { MarqueeBar } from "@/components/sections/marquee-bar";
import { MultiFeature } from "@/components/sections/multi-feature";
import { Newsletter } from "@/components/sections/newsletter";
import { PersonalizedFormulas } from "@/components/sections/personalized-formulas";
import { ProductGrid } from "@/components/sections/product-grid";
import { SaleBanner } from "@/components/sections/sale-banner";
import { Testimonials } from "@/components/sections/testimonials";
import { TrustSection } from "@/components/sections/trust-section";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main>
			{/* 1. Hero banners */}
			<Hero />

			{/* 2. What Healthy Skin Looks Like - product carousel placeholder */}
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="What Healthy Skin Looks Like" limit={5} columns={5} />

			{/* 3. Shop By Categories */}
			<Suspense>
				<CategoriesGrid />
			</Suspense>

			{/* 4. Define Beauty */}
			<DefineBeauty />

			{/* 5. Featured Products */}
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Featured Products" limit={5} columns={5} />

			{/* 6. Sale Banner */}
			<SaleBanner />

			{/* 7. Lookbook - Backed by Science */}
			<Lookbook />

			{/* 8. Marquee Bar */}
			<MarqueeBar />

			{/* 9. Hydrate Your Skin */}
			<HydrateSkin />

			{/* 10. Personalized Formulas */}
			<PersonalizedFormulas />

			{/* 11. Make Everyday a Good Skin Day */}
			<GoodSkinDay />

			{/* 12. Multi Feature - Make Us a Part of Your Journey */}
			<MultiFeature />

			{/* 13. Trust Section */}
			<TrustSection />

			{/* 14. Testimonials */}
			<Testimonials />

			{/* 15. Newsletter */}
			<Newsletter />
		</main>
	);
}
