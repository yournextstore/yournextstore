import type { Metadata } from "next";
import { Suspense } from "react";
import { Bundles } from "@/components/sections/bundles";
import { Editorial } from "@/components/sections/editorial";
import { FAQ } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { Macros } from "@/components/sections/macros";
import { Newsletter } from "@/components/sections/newsletter";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";
import { ReviewsWall } from "@/components/sections/reviews-wall";

function HeroSkeleton() {
	return (
		<section className="bg-black h-[80vh] flex items-center justify-center">
			<div className="text-white/30 font-display uppercase tracking-[0.2em] text-xs">Loading…</div>
		</section>
	);
}

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main className="bg-black">
			<Suspense fallback={<HeroSkeleton />}>
				<Hero />
			</Suspense>
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Shop the flavors" limit={8} />
			<Macros />
			<Editorial />
			<ReviewsWall />
			<Press />
			<Bundles />
			<FAQ />
			<Newsletter />
		</main>
	);
}
