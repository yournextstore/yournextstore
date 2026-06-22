import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { HomeFAQ } from "@/components/sections/home-faq";
import { Marquee } from "@/components/sections/marquee";
import { ProductGrid } from "@/components/sections/product-grid";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main>
			<Hero />
			<Marquee />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Our wholesome lineup" description="Family-roasted, in small batches." limit={8} />
			<HomeFAQ />
		</main>
	);
}
