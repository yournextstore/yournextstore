import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { Community } from "@/components/sections/community";
import { Hero } from "@/components/sections/hero";
import { LifestyleBanner } from "@/components/sections/lifestyle-banner";
import { Newsletter } from "@/components/sections/newsletter";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";
import { ValueProps } from "@/components/sections/value-props";

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
				title="Shop the flavors"
				description="Bold marinades. Better protein. Pick your pouch."
				limit={3}
			/>
			<ValueProps />
			<LifestyleBanner />
			<Press />
			<Community />
			<About />
			<Newsletter />
		</>
	);
}
