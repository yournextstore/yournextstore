import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { BuildPromo } from "@/components/sections/build-promo";
import { Categories } from "@/components/sections/categories";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main className="relative">
			<Hero />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="/featured" limit={6} />
			<Categories />
			<BuildPromo />
			<About />
			<Newsletter />
		</main>
	);
}
