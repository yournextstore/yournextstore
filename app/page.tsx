import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { Toolkit } from "@/components/sections/toolkit";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// No demo-preview read here: `searchParams` would make the home per request and take it out of the prerendered
// shell. No <Suspense> either: the grid is "use cache", so it renders in document order.
export default function Home() {
	return (
		<>
			<Hero />
			<ProductGrid title="Latest creator drops" limit={6} />
			<About />
			<Toolkit />
			<Newsletter />
		</>
	);
}
