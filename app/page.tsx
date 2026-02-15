import { Suspense } from "react";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { FeaturedProduct } from "@/components/sections/featured-product";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { Recipes } from "@/components/sections/recipes";
import { SecretSauce } from "@/components/sections/secret-sauce";
import { Testimonials } from "@/components/sections/testimonials";

function ProductGridSkeleton() {
	return (
		<section className="max-w-[1820px] mx-auto px-5 sm:px-8 lg:px-10 py-16 sm:py-24">
			<div className="flex items-end justify-between mb-12">
				<div>
					<div className="h-10 w-48 bg-secondary rounded animate-pulse" />
					<div className="mt-3 h-5 w-64 bg-secondary rounded animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-secondary rounded-md mb-4 animate-pulse border-[3px] border-foreground/10" />
						<div className="space-y-2">
							<div className="h-5 w-3/4 bg-secondary rounded animate-pulse" />
							<div className="h-5 w-1/4 bg-secondary rounded animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<main>
			<Hero />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Our Goods" description="You'll be cooking like a pro in no time." limit={8} />
			</Suspense>
			<Testimonials />
			<ComparisonTable />
			<FeaturedProduct />
			<Recipes />
			<SecretSauce />
			<Newsletter />
		</main>
	);
}
