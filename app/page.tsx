import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { Journal } from "@/components/sections/journal";
import { Marquee } from "@/components/sections/marquee";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { Testimonials } from "@/components/sections/testimonials";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<Marquee />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Explore the Apothecary" limit={8} />
			<About />
			<Testimonials />
			<Journal />
			<Newsletter />
		</>
	);
}
