import { Suspense } from "react";
import { Benefits } from "@/components/sections/benefits";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { Results } from "@/components/sections/results";
import { UgcWall } from "@/components/sections/ugc-wall";

function ProductGridSkeleton() {
	return (
		<section className="yns-pink-band">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-14">
				<div className="h-10 w-72 bg-white/30 mb-10 animate-pulse" />
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
					{Array.from({ length: 8 }).map((_, i) => (
						<div key={`skeleton-${i}`} className="bg-white p-4 sm:p-6">
							<div className="aspect-square bg-[color:var(--yns-cream)] mb-4 animate-pulse" />
							<div className="space-y-2">
								<div className="h-3 w-3/4 mx-auto bg-[color:var(--yns-cream)] animate-pulse" />
								<div className="h-3 w-1/3 mx-auto bg-[color:var(--yns-cream)] animate-pulse" />
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
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="YNS Must-Haves" limit={8} variant="pink-band" />
			</Suspense>
			<Benefits />
			<Results />
			<UgcWall />
			<Newsletter />
		</>
	);
}
