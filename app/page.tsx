import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { Founders } from "@/components/sections/founders";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";
import { ValueProps } from "@/components/sections/value-props";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main className="bg-cream-paper">
			<Hero />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Pick Your Flavor" limit={6} />
			<About />
			<ValueProps />
			<Press />
			<Founders />
			<Newsletter />
		</main>
	);
}
