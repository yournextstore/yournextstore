import type { Metadata } from "next";
import {
	Benefits,
	FaqBlock,
	Feature,
	Hero,
	Insights,
	NewsletterBand,
	ProductsRail,
	Showcase,
} from "@/components/sections/home";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<Feature />
			<Showcase />
			{/* Cached sections render without a boundary: a Suspense here would stream them in after the
			    first flush and shift everything below (see PLAYBOOK §4). */}
			<ProductsRail />
			<FaqBlock />
			<Benefits />
			<NewsletterBand />
			<Insights />
		</>
	);
}
