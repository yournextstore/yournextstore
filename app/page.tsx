import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { CouponMarquee } from "@/components/sections/coupon-marquee";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { SupportedBy } from "@/components/sections/supported-by";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="flex items-end justify-between mb-10">
				<div>
					<div className="h-8 w-48 bg-secondary rounded animate-pulse" />
					<div className="mt-2 h-5 w-64 bg-secondary rounded animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`} className="rounded-3xl bg-secondary p-3 sm:p-4">
						<div className="aspect-square bg-accent rounded-2xl mb-4 animate-pulse" />
						<div className="space-y-2">
							<div className="h-5 w-3/4 bg-accent rounded animate-pulse" />
							<div className="h-5 w-1/4 bg-accent rounded animate-pulse" />
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
			<CouponMarquee />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="The Collection" limit={8} />
			</Suspense>
			<About />
			<SupportedBy />
			<Newsletter />
		</>
	);
}
