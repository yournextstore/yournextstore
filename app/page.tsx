import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { Flavors } from "@/components/sections/flavors";
import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<Marquee />
			<About />
			<Flavors />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Featured Drops" description="Cool things, freshly poured." limit={6} />
			<Newsletter />
		</>
	);
}
