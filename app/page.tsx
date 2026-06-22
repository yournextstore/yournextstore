import { Suspense } from "react";
import {
	BuildYourBox,
	HowItWorks,
	LifestyleStrip,
	PressStrip,
	UgcGallery,
} from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="bg-yns-cream-soft border-y-2 border-[color:var(--border)]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="text-center mb-12">
					<div className="h-7 w-40 mx-auto bg-secondary rounded animate-pulse" />
					<div className="mt-3 h-10 w-64 mx-auto bg-secondary rounded animate-pulse" />
				</div>
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
					{Array.from({ length: 8 }).map((_, i) => (
						<div key={`skeleton-${i}`}>
							<div className="aspect-square bg-secondary rounded-3xl mb-3 animate-pulse" />
							<div className="h-5 w-3/4 mx-auto bg-secondary rounded animate-pulse" />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<main className="bg-yns-cream">
			<Hero />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Shop the flavor packs" limit={8} />
			</Suspense>
			<HowItWorks />
			<LifestyleStrip />
			<PressStrip />
			<BuildYourBox />
			<UgcGallery />
			<Newsletter />
		</main>
	);
}
