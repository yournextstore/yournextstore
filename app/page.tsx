import type { Metadata } from "next";
import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Categories } from "@/components/sections/categories";
import { FaqPreview } from "@/components/sections/faq-preview";
import { Hero } from "@/components/sections/hero";
import { Journal } from "@/components/sections/journal";
import { ProductGrid } from "@/components/sections/product-grid";
import { ValueProps } from "@/components/sections/value-props";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main>
			<Hero />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid limit={3} variant="favorites" />
			<Suspense>
				<Categories />
			</Suspense>
			<About />
			<ValueProps />
			<FaqPreview />
			<Journal />
		</main>
	);
}
