import { Suspense } from "react";
import { Benefits } from "@/components/sections/benefits";
import { EditorialSplit } from "@/components/sections/editorial-split";
import { Hero } from "@/components/sections/hero";
import { MerchLookbook } from "@/components/sections/merch-lookbook";
import { Newsletter } from "@/components/sections/newsletter";
import { PressBar } from "@/components/sections/press-bar";
import { ProductGrid } from "@/components/sections/product-grid";
import { UGCGrid } from "@/components/sections/ugc-grid";

function ProductGridSkeleton() {
	return (
		<section className="bg-[#fbf6ec] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
			<div className="mb-12 sm:mb-16">
				<div className="h-3 w-32 bg-[#f4ecdc] rounded animate-pulse" />
				<div className="mt-3 h-12 w-72 bg-[#f4ecdc] rounded animate-pulse" />
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-12">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-[#f4ecdc] rounded-[3px] mb-5 animate-pulse" />
						<div className="space-y-2">
							<div className="h-6 w-3/4 bg-[#f4ecdc] rounded animate-pulse" />
							<div className="h-3 w-1/4 bg-[#f4ecdc] rounded animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<>
			<Hero />
			<Benefits />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Best-Selling Flavors" limit={6} />
			</Suspense>
			<EditorialSplit />
			<MerchLookbook />
			<PressBar />
			<UGCGrid />
			<Newsletter />
		</>
	);
}
