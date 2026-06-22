import type { Metadata } from "next";
import { Community } from "@/components/sections/community";
import { Editorial } from "@/components/sections/editorial";
import { FeatureRow } from "@/components/sections/feature-row";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";
import { Values } from "@/components/sections/values";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main className="bg-[var(--cream)]">
			<Hero />
			<FeatureRow />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid
				title="Shop the essentials"
				eyebrow="— Featured"
				description="Quiet objects designed to live with you, season after season."
				limit={6}
			/>
			<Community />
			<Editorial />
			<Values />
			<Press />
			<Newsletter />
		</main>
	);
}
