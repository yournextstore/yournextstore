import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { Hero } from "@/components/sections/hero";
import { ProductGrid } from "@/components/sections/product-grid";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

function TrendingSkeleton() {
	return (
		<section className="page-container mt-5 md:mt-9 lg:mt-16">
			<div className="mb-3 h-9 w-48 animate-pulse rounded bg-secondary lg:h-12" />
			<ProductGridSkeleton />
		</section>
	);
}

// The original's home is exactly two things: the fitted-word hero and a "Trending now" grid.
export default function Home() {
	return (
		<>
			<Hero />
			<Suspense fallback={<TrendingSkeleton />}>
				<ProductGrid title="Trending now" limit={6} />
			</Suspense>
		</>
	);
}
