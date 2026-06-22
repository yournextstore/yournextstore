import type { Metadata } from "next";
import { Editorial } from "@/components/sections/editorial";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";
import { Routine } from "@/components/sections/routine";
import { Testimonials } from "@/components/sections/testimonials";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Shop Our Best Sellers" limit={4} />
			<Editorial />
			<Routine />
			<Press />
			<Testimonials />
			<Newsletter />
		</>
	);
}
