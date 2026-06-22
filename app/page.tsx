import type { Metadata } from "next";
import { Suspense } from "react";
import { CategoryPills } from "@/components/sections/category-pills";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { PromoTiles } from "@/components/sections/promo-tiles";

function PillsSkeleton() {
	return (
		<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div className="h-24 animate-pulse rounded-3xl bg-white shadow-card" />
		</section>
	);
}

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<Suspense fallback={<PillsSkeleton />}>
				<CategoryPills />
			</Suspense>
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid
				title="You might need"
				description="Fresh staples picked just for you"
				limit={10}
				viewAllHref="/products"
			/>
			<PromoTiles />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid
				title="Weekly best selling items"
				description="What other shoppers are loving this week"
				limit={10}
				offset={10}
				viewAllHref="/products"
				tone="muted"
			/>
			<CtaBanner />
			<Newsletter />
		</>
	);
}
