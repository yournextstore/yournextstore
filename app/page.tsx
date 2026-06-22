import type { Metadata } from "next";
import { BeautifulDetails } from "@/components/sections/beautiful-details";
import { BeautifulPractical } from "@/components/sections/beautiful-practical";
import { ClassicHandbags } from "@/components/sections/classic-handbags";
import { Hero } from "@/components/sections/hero";
import { JournalSection } from "@/components/sections/journal-section";
import { ProductGrid } from "@/components/sections/product-grid";
import { PromoBar } from "@/components/sections/promo-bar";
import { SimpleElegant } from "@/components/sections/simple-elegant";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main>
			<Hero />
			<ClassicHandbags />
			<BeautifulPractical />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Popular picks" limit={4} />
			<PromoBar />
			<BeautifulDetails />
			<JournalSection />
			<SimpleElegant />
		</main>
	);
}
