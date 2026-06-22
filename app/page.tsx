import type { Metadata } from "next";
import { Benefits } from "@/components/sections/benefits";
import { Categories } from "@/components/sections/categories";
import { Founder } from "@/components/sections/founder";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Ingredients } from "@/components/sections/ingredients";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { QuizCta } from "@/components/sections/quiz-cta";
import { Testimonials } from "@/components/sections/testimonials";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<Categories />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Featured Strips" limit={6} />
			<HowItWorks />
			<Benefits />
			<Ingredients />
			<Testimonials />
			<Founder />
			<QuizCta />
			<Newsletter />
		</>
	);
}
