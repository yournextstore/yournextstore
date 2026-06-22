import { Suspense } from "react";
import { BundleBuilder } from "@/components/sections/bundle-builder";
import { FAQ } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { Lifestyle } from "@/components/sections/lifestyle";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";
import { ShopByColor } from "@/components/sections/shop-by-color";

function ProductGridSkeleton() {
	return (
		<section className="bg-[#f5efe6] py-20 sm:py-28">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
				<div className="flex items-end justify-between mb-12">
					<div>
						<div className="h-8 w-48 bg-[#e8dfd0] rounded animate-pulse" />
						<div className="mt-3 h-5 w-64 bg-[#e8dfd0] rounded animate-pulse" />
					</div>
				</div>
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
					{Array.from({ length: 8 }).map((_, i) => (
						<div key={`skeleton-${i}`}>
							<div className="aspect-[4/5] bg-[#e8dfd0] rounded-3xl mb-4 animate-pulse" />
							<div className="space-y-2">
								<div className="h-4 w-3/4 bg-[#e8dfd0] rounded animate-pulse" />
								<div className="h-4 w-1/4 bg-[#e8dfd0] rounded animate-pulse" />
							</div>
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
			<ShopByColor />
			<BundleBuilder />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Best-sellers, on repeat" limit={8} />
			</Suspense>
			<Lifestyle />
			<PressStrip />
			<FAQ />
			<Newsletter />
		</>
	);
}
