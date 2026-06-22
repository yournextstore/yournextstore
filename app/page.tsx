import type { Metadata } from "next";
import { EditorialPortrait } from "@/components/sections/editorial-portrait";
import { Hero } from "@/components/sections/hero";
import { NaturalIngredients } from "@/components/sections/natural-ingredients";
import { ProductGrid } from "@/components/sections/product-grid";
import { Reviews } from "@/components/sections/reviews";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main>
			<Hero />
			<NaturalIngredients />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="The Edit" eyebrow="Featured Collection" limit={4} />
			<EditorialPortrait />
			<Reviews />
		</main>
	);
}
