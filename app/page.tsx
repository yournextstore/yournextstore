import type { Metadata } from "next";
import { Benefits } from "@/components/sections/benefits";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { Results } from "@/components/sections/results";
import { UgcWall } from "@/components/sections/ugc-wall";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="YNS Must-Haves" limit={8} variant="pink-band" />
			<Benefits />
			<Results />
			<UgcWall />
			<Newsletter />
		</>
	);
}
