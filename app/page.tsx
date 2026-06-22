import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { AuthorSpotlight } from "@/components/sections/author-spotlight";
import { EditorialCards } from "@/components/sections/editorial-cards";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<About />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid limit={8} variant="shelf" />
			<EditorialCards />
			<PressStrip />
			<AuthorSpotlight />
			<Newsletter />
		</>
	);
}
