import type { Metadata } from "next";
import {
	BuildYourBox,
	HowItWorks,
	LifestyleStrip,
	PressStrip,
	UgcGallery,
} from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main className="bg-yns-cream">
			<Hero />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Shop the flavor packs" limit={8} />
			<HowItWorks />
			<LifestyleStrip />
			<PressStrip />
			<BuildYourBox />
			<UgcGallery />
			<Newsletter />
		</main>
	);
}
