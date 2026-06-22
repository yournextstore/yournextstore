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

function ProductGridSkeleton() {
	return (
		<section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 sm:py-20">
			<div className="flex items-end justify-between mb-10">
				<div>
					<div className="h-8 w-48 bg-secondary animate-pulse" />
					<div className="mt-2 h-5 w-64 bg-secondary animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[3/4] bg-secondary mb-3 animate-pulse" />
						<div className="space-y-2 flex flex-col items-center">
							<div className="h-4 w-3/4 bg-secondary animate-pulse" />
							<div className="h-4 w-1/4 bg-secondary animate-pulse" />
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
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Homewares" description="Browse our curated collection" limit={6} />
			</Suspense>

			{/* 11. Promo bar - shipping, sustainable, locally made */}
			<PromoBar />
		</main>
	);
}
