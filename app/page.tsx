import type { Metadata } from "next";
import { Benefits } from "@/components/sections/benefits";
import { EditorialSplit } from "@/components/sections/editorial-split";
import { Hero } from "@/components/sections/hero";
import { MerchLookbook } from "@/components/sections/merch-lookbook";
import { Newsletter } from "@/components/sections/newsletter";
import { PressBar } from "@/components/sections/press-bar";
import { ProductGrid } from "@/components/sections/product-grid";
import { UGCGrid } from "@/components/sections/ugc-grid";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<Benefits />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Best-Selling Flavors" limit={6} />
			<EditorialSplit />
			<MerchLookbook />
			<PressBar />
			<UGCGrid />
			<Newsletter />
		</>
	);
}
