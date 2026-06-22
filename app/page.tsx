import type { Metadata } from "next";
import { Benefits } from "@/components/sections/benefits";
import { Blog } from "@/components/sections/blog";
import { CtaBanner } from "@/components/sections/cta-banner";
import { FAQs } from "@/components/sections/faqs";
import { Hero } from "@/components/sections/hero";
import { Impact } from "@/components/sections/impact";
import { ProductGrid } from "@/components/sections/product-grid";
import { Testimonials } from "@/components/sections/testimonials";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main>
			<Hero />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Featured Products" limit={6} />
			<Benefits />
			<Testimonials />
			<Impact />
			<Blog />
			<FAQs />
			<CtaBanner />
		</main>
	);
}
