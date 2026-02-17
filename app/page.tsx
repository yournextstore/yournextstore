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

function ProductGridSkeleton() {
	return (
		<section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
			<div className="mb-10 flex items-end justify-between">
				<div>
					<div className="h-8 w-48 animate-pulse rounded bg-secondary" />
					<div className="mt-2 h-5 w-64 animate-pulse rounded bg-secondary" />
				</div>
			</div>
			<div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[3/4] animate-pulse rounded-sm bg-secondary" />
						<div className="mt-3 space-y-2">
							<div className="h-4 w-3/4 animate-pulse rounded bg-secondary" />
							<div className="h-4 w-1/3 animate-pulse rounded bg-secondary" />
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
			{/* 1. Hero banners */}
			<Hero />

			{/* 2. What Healthy Skin Looks Like - product carousel placeholder */}
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="What Healthy Skin Looks Like" limit={5} columns={5} />
			</Suspense>

			{/* 3. Shop By Categories */}
			<Suspense>
				<CategoriesGrid />
			</Suspense>

			{/* 4. Define Beauty */}
			<DefineBeauty />

			{/* 5. Featured Products */}
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Featured Products" limit={5} columns={5} />
			</Suspense>

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
