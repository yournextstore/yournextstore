import type { Metadata } from "next";
import { About, EditorialParagraph } from "@/components/sections/about";
import { FAQHome } from "@/components/sections/faq-home";
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
			<EditorialParagraph />
			<About />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Featured products" description="Pieces in the season's quiet rotation." limit={8} />
			<FAQHome />
			<Newsletter />
		</>
	);
}
