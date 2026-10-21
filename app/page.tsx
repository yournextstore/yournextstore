import type { Metadata } from "next";
import { Categories } from "@/components/sections/categories";
import { Hero } from "@/components/sections/hero";
import { Trending } from "@/components/sections/trending";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Every section is a cached read, rendered without its own Suspense boundary so the whole home
// page lands in the prerendered document (no streamed segment, no layout shift).
export default function Home() {
	return (
		<>
			<Hero />
			<Trending />
			<Categories />
		</>
	);
}
