import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { MaterialStrip } from "@/components/sections/material-strip";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { Tribute } from "@/components/sections/tribute";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid
				title="The Menu"
				description="A small, slowly-rotating selection of pieces in stock today — each named, dated, and finished by hand."
				eyebrow="Vol. 01 — featured"
				limit={6}
			/>
			<Tribute />
			<MaterialStrip />
			<About />
			<Newsletter />
		</>
	);
}
