import type { Metadata } from "next";
import { FeaturedProducts, NewArrivals } from "@/components/sections/featured-products";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// The product sections are cached reads rendered without a Suspense boundary, so they land in
// the prerendered page instead of streaming in and shifting the layout below the slideshow.
export default function Home() {
	return (
		<>
			<Hero />
			<FeaturedProducts />
			<NewArrivals />
			<Newsletter />
		</>
	);
}
