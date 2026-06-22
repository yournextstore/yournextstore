import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { InstagramWall } from "@/components/sections/instagram-wall";
import { Newsletter } from "@/components/sections/newsletter";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";
import { Story } from "@/components/sections/story";
import { TeaClub } from "@/components/sections/tea-club";
import { TrustStrip } from "@/components/sections/trust-strip";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 sm:py-24">
			<div className="text-center max-w-2xl mx-auto">
				<div className="h-3 w-32 bg-[color:var(--color-yns-blue-200)] mx-auto rounded animate-pulse" />
				<div className="mt-5 h-12 w-2/3 bg-[color:var(--color-yns-blue-100)] mx-auto rounded animate-pulse" />
			</div>
			<div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[4/5] bg-[color:var(--color-yns-blue-100)] mb-5 animate-pulse" />
						<div className="space-y-2">
							<div className="h-5 w-3/4 bg-[color:var(--color-yns-blue-100)] rounded animate-pulse" />
							<div className="h-5 w-1/4 bg-[color:var(--color-yns-blue-100)] rounded animate-pulse" />
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
			<TrustStrip />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid
					title="Flagship blends"
					description="Single-garden leaves, slow-oxidised and packed within seven days of harvest."
					limit={3}
				/>
			</Suspense>
			<Story />
			<TeaClub />
			<Press />
			<About />
			<InstagramWall />
			<Newsletter />
		</>
	);
}
