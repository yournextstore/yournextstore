import type { Metadata } from "next";
import { BundleBuilder } from "@/components/sections/bundle-builder";
import { FAQ } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { Lifestyle } from "@/components/sections/lifestyle";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";
import { ShopByColor } from "@/components/sections/shop-by-color";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<ShopByColor />
			<BundleBuilder />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Best-sellers, on repeat" limit={8} />
			<Lifestyle />
			<PressStrip />
			<FAQ />
			<Newsletter />
		</>
	);
}
