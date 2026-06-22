import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { CollectionGrid } from "@/components/sections/collection-grid";
import { FeelingStripe } from "@/components/sections/feeling-stripe";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { PressWall } from "@/components/sections/press-wall";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="bg-background">
			<div className="max-w-[100rem] mx-auto grid grid-cols-1 lg:grid-cols-12">
				<div className="lg:col-span-3 aspect-[4/5] lg:aspect-auto lg:min-h-[600px] bg-secondary animate-pulse" />
				<div className="lg:col-span-9 px-4 sm:px-6 lg:px-12 py-14 lg:py-20">
					<div className="h-7 w-48 bg-secondary rounded animate-pulse mb-3" />
					<div className="h-10 w-72 bg-secondary rounded animate-pulse mb-12" />
					<div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 sm:gap-x-8 gap-y-10">
						{Array.from({ length: 6 }).map((_, i) => (
							<div key={`s-${i}`}>
								<div className="aspect-[4/5] bg-secondary mb-5 animate-pulse" />
								<div className="h-4 w-2/3 bg-secondary mb-2 animate-pulse" />
								<div className="h-3 w-1/4 bg-secondary animate-pulse" />
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<>
			<Hero />
			<FeelingStripe />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid
					title="Best Sellers"
					description="Six shades. Eight hours of wear. Zero compromises."
					limit={6}
				/>
			</Suspense>
			<Suspense>
				<CollectionGrid />
			</Suspense>
			<About />
			<PressWall />
			<Newsletter />
		</>
	);
}
