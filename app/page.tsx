import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductCardSkeleton } from "@/components/product-grid-skeleton";
import { CollectionsBand } from "@/components/sections/collections-band";
import { Hero } from "@/components/sections/hero";
import { ProductGrid } from "@/components/sections/product-grid";

function FeaturedProductsSkeleton() {
	return (
		<section className="shell py-16">
			<div className="mb-8 flex h-11 items-center justify-between">
				<div className="h-8 w-56 animate-pulse rounded bg-gray-100" />
			</div>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{[0, 1, 2, 3].map((i) => (
					<div
						key={i}
						className={i === 0 ? "" : i === 1 ? "max-sm:hidden" : i === 2 ? "max-md:hidden" : "max-lg:hidden"}
					>
						<ProductCardSkeleton />
					</div>
				))}
			</div>
		</section>
	);
}

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<Suspense fallback={<FeaturedProductsSkeleton />}>
				<ProductGrid title="Featured Products" limit={8} layout="carousel" />
			</Suspense>
			<CollectionsBand />
		</>
	);
}
