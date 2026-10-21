import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { CategoryShowcase } from "@/components/sections/category-showcase";
import { CollectionsCarousel } from "@/components/sections/collections-carousel";
import { Hero } from "@/components/sections/hero";
import { ProductGrid } from "@/components/sections/product-grid";
import { Story } from "@/components/sections/story";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<div className="flex flex-col gap-26 pt-26 pb-26 md:gap-36 md:pt-36 md:pb-36">
				{/* Cached reads, outside any boundary, so they prerender with the shell. */}
				<CategoryShowcase />
				<CollectionsCarousel />
				<Suspense
					fallback={
						<div className="layout">
							<ProductGridSkeleton className="col-span-full" />
						</div>
					}
				>
					<ProductGrid title="Featured products" limit={6} />
				</Suspense>
				<Story />
			</div>
		</>
	);
}
