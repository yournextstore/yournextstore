import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { Features } from "@/components/sections/features";
import { Hero } from "@/components/sections/hero";
import { InstagramGrid } from "@/components/sections/instagram";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main>
			<Hero />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="The Lineup" limit={6} />
			<Features />
			<About />
			<PressStrip />
			<Newsletter />
			<InstagramGrid />
		</main>
	);
}
