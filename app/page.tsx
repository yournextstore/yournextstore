import type { Metadata } from "next";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { FeaturedProduct } from "@/components/sections/featured-product";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { Recipes } from "@/components/sections/recipes";
import { SecretSauce } from "@/components/sections/secret-sauce";
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
			<ProductGrid title="Our Goods" description="You'll be cooking like a pro in no time." limit={8} />
			<Testimonials />
			<ComparisonTable />
			<FeaturedProduct />
			<Recipes />
			<SecretSauce />
			<Newsletter />
		</>
	);
}
