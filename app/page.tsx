import { Suspense } from "react";
import { ClaimsBand } from "@/components/sections/claims-band";
import { EditorialSplit } from "@/components/sections/editorial-split";
import { Hero } from "@/components/sections/hero";
import { InMotionGallery } from "@/components/sections/in-motion-gallery";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton({ count = 6 }: { count?: number }) {
	return (
		<section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 sm:py-28 lg:px-10">
			<div className="mb-12 flex items-end justify-between border-b border-border/60 pb-8">
				<div>
					<div className="h-3 w-24 bg-secondary animate-pulse" />
					<div className="mt-4 h-10 w-72 bg-secondary animate-pulse" />
					<div className="mt-3 h-4 w-96 bg-secondary animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: count }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[4/5] bg-secondary animate-pulse" />
						<div className="mt-5 flex justify-between gap-3">
							<div className="h-5 w-2/3 bg-secondary animate-pulse" />
							<div className="h-5 w-12 bg-secondary animate-pulse" />
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
			<Suspense fallback={<ProductGridSkeleton count={3} />}>
				<ProductGrid
					variant="debut"
					title="Meet Lock & Go."
					description="A setting spray engineered to outlast your day."
					eyebrow="Debut Product"
					limit={3}
					viewAllHref="/products"
				/>
			</Suspense>
			<ClaimsBand />
			<EditorialSplit />
			<PressStrip />
			<InMotionGallery />
			<Suspense fallback={<ProductGridSkeleton count={6} />}>
				<ProductGrid
					title="Shop the Collection"
					description="Performance beauty, head to toe."
					eyebrow="The Edit"
					limit={6}
				/>
			</Suspense>
			<Newsletter />
		</>
	);
}
