import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { DreamDecor } from "@/components/sections/dream-decor";
import { FeaturedCollection } from "@/components/sections/featured-collection";
import { Hero } from "@/components/sections/hero";
import { Journal } from "@/components/sections/journal";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { SustainableBanner } from "@/components/sections/sustainable-banner";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main className="pb-20">
			<Hero />
			<DreamDecor />
			<FeaturedCollection />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid limit={8} />
			<SustainableBanner />
			<About />
			<Journal />
			<Newsletter />
		</main>
	);
}
