import type { Metadata } from "next";
import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { CollectionsStrip } from "@/components/sections/collections-strip";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
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
			<ProductGrid title="Fresh this week" limit={8} />
			<Suspense>
				<CollectionsStrip />
			</Suspense>
			<About />
			<Newsletter />
		</>
	);
}
