import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Benefits } from "@/components/sections/benefits";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="bg-[#f5efe3]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="text-center max-w-2xl mx-auto mb-14">
					<div className="h-3 w-24 bg-[#ece4d2] mx-auto rounded animate-pulse" />
					<div className="mt-5 h-10 w-72 bg-[#ece4d2] mx-auto rounded animate-pulse" />
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={`skeleton-${i}`}>
							<div className="aspect-square bg-[#ebe4d3] animate-pulse" />
							<div className="mt-6 mx-auto h-3 w-32 bg-[#ece4d2] rounded animate-pulse" />
							<div className="mt-2 mx-auto h-3 w-14 bg-[#ece4d2] rounded animate-pulse" />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<>
			<Hero />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid limit={3} showViewAll={true} />
			</Suspense>
			<About />
			<Benefits />
			<Press />
			<Newsletter />
		</>
	);
}
