import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { Diaries } from "@/components/sections/diaries";
import { Hero } from "@/components/sections/hero";
import { Ingredients } from "@/components/sections/ingredients";
import { Newsletter } from "@/components/sections/newsletter";
import { PressMarquee } from "@/components/sections/press-marquee";
import { ProductGrid } from "@/components/sections/product-grid";
import { TaglineStrip } from "@/components/sections/tagline-strip";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<TaglineStrip />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid limit={3} />
			<About />
			<PressMarquee />
			<Diaries />
			<Ingredients />
			<Newsletter />
		</>
	);
}
