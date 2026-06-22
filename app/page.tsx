import type { Metadata } from "next";
import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Editorial } from "@/components/sections/editorial";
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
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="The catalogue" limit={8} eyebrow="N° 01 — Featured" />
			<Suspense>
				<Editorial />
			</Suspense>
			<About />
			<Newsletter />
		</>
	);
}
