import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { GiftCollections } from "@/components/sections/gift-collections";
import { Hero } from "@/components/sections/hero";
import { MarqueeBadge } from "@/components/sections/marquee-badge";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { RecipesCallout } from "@/components/sections/recipes-callout";
import { Story } from "@/components/sections/story";
import { Testimonials } from "@/components/sections/testimonials";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<MarqueeBadge />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Cookies Fresh from the Oven" limit={8} />
			<GiftCollections />
			<Story />
			<RecipesCallout />
			<About />
			<Testimonials />
			<Newsletter />
		</>
	);
}
