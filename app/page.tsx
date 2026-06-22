import type { Metadata } from "next";
import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { BrandMarquee } from "@/components/sections/brand-marquee";
import { CategoriesStrip } from "@/components/sections/categories";
import { EditorialBanner } from "@/components/sections/editorial-banner";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

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

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main>
			<Suspense fallback={<HeroSkeleton />}>
				<Hero />
			</Suspense>
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid eyebrow="The Edit" title="Women's Tops" limit={8} viewAllHref="/products" />
			<CategoriesStrip />
			<EditorialBanner />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid
				eyebrow="Just In"
				title="Featured Designers"
				limit={4}
				asymmetric={false}
				viewAllHref="/products"
			/>
			<BrandMarquee />
			<About />
			<Newsletter />
		</main>
	);
}
