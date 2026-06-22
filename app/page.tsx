import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { FaqYellow } from "@/components/sections/faq-yellow";
import { FlavorCards } from "@/components/sections/flavor-cards";
import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";
import { PromoBanner } from "@/components/sections/promo-banner";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<FlavorCards />
			<Marquee />
			<About />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Bestsellers" overline="Top of the charts" limit={8} />
			<PromoBanner />
			<PressStrip />
			<FaqYellow />
			<Newsletter />
		</>
	);
}
