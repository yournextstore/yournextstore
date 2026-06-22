import type { Metadata } from "next";
import { Editorial } from "@/components/sections/editorial";
import { Hero } from "@/components/sections/hero";
import { Ingredients } from "@/components/sections/ingredients";
import { Newsletter } from "@/components/sections/newsletter";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";
import { Ritual } from "@/components/sections/ritual";
import { ShowcaseStrip } from "@/components/sections/showcase-strip";
import { Testimonial } from "@/components/sections/testimonial";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<Ritual />
			<ShowcaseStrip />
			<Editorial />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="The Bestsellers" eyebrow="— Loved by many" limit={4} />
			<Testimonial />
			<Press />
			<Ingredients />
			<Newsletter />
		</>
	);
}
