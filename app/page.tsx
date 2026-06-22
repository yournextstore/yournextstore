import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { Benefits } from "@/components/sections/benefits";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid limit={3} showViewAll={true} />
			<About />
			<Benefits />
			<Press />
			<Newsletter />
		</>
	);
}
