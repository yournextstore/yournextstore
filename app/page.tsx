import { Suspense } from "react";
import { CollectionsShowcase } from "@/components/sections/collections-showcase";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Hero } from "@/components/sections/hero";
import { ImageCardBanner } from "@/components/sections/image-card-banner";
import { ProductGrid } from "@/components/sections/product-grid";
import { PromoBanner } from "@/components/sections/promo-banner";
import { TextWithImages } from "@/components/sections/text-with-images";
import { TrustStrip } from "@/components/sections/trust-strip";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<div className="flex items-end justify-between mb-8">
				<div>
					<div className="h-8 w-48 bg-secondary rounded animate-pulse" />
					<div className="mt-2 h-5 w-64 bg-secondary rounded animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[3/4] bg-secondary rounded-lg mb-3 animate-pulse" />
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
			<Hero />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="What's Hot" description="Our most loved products this season" limit={8} />
			</Suspense>
			<TextWithImages />
			<Suspense>
				<CollectionsShowcase />
			</Suspense>
			<PromoBanner />
			<TrustStrip />
			<CtaBanner />
			<ImageCardBanner />
		</main>
	);
}
