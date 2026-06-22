import type { Metadata } from "next";
import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Categories } from "@/components/sections/categories";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { Promo } from "@/components/sections/promo";

function CategoriesSkeleton() {
	return (
		<section className="bg-[var(--olive-deep)] py-20 sm:py-28">
			<div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={`cat-${i}`} className="aspect-[3/4] rounded-3xl bg-[var(--cream)]/5 animate-pulse" />
					))}
				</div>
			</div>
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
			<Suspense fallback={<CategoriesSkeleton />}>
				<Categories />
			</Suspense>
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Popular Products" eyebrow="This Season" limit={8} />
			<Promo />
			<About />
			<Newsletter />
		</>
	);
}
