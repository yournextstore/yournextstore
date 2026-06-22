import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { BrandMarquee } from "@/components/sections/brand-marquee";
import { CategoriesStrip } from "@/components/sections/categories";
import { EditorialBanner } from "@/components/sections/editorial-banner";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="mx-auto max-w-[1440px] px-6 py-14 lg:px-12 lg:py-20">
			<div className="mb-10 flex items-end justify-between">
				<div>
					<div className="h-3 w-24 bg-secondary animate-pulse" />
					<div className="mt-3 h-8 w-48 bg-secondary animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[4/5] bg-secondary animate-pulse" />
						<div className="mt-4 space-y-2">
							<div className="h-3 w-20 bg-secondary animate-pulse" />
							<div className="h-4 w-3/4 bg-secondary animate-pulse" />
							<div className="h-4 w-1/4 bg-secondary animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

function HeroSkeleton() {
	return (
		<section className="bg-editorial-gradient">
			<div className="mx-auto max-w-[1440px] px-6 pt-10 pb-6 lg:px-12">
				<div className="h-3 w-40 bg-background/40 animate-pulse" />
				<div className="mt-8 h-20 w-3/4 bg-background/40 animate-pulse" />
				<div className="mt-10 h-10 w-full bg-background/40 animate-pulse" />
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<main>
			<Suspense fallback={<HeroSkeleton />}>
				<Hero />
			</Suspense>
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid eyebrow="The Edit" title="Women's Tops" limit={8} viewAllHref="/products" />
			</Suspense>
			<CategoriesStrip />
			<EditorialBanner />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid
					eyebrow="Just In"
					title="Featured Designers"
					limit={4}
					asymmetric={false}
					viewAllHref="/products"
				/>
			</Suspense>
			<BrandMarquee />
			<About />
			<Newsletter />
		</main>
	);
}
