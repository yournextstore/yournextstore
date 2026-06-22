import { Suspense } from "react";
import { FlavorRow } from "@/components/sections/flavor-row";
import { Hero } from "@/components/sections/hero";
import { Lifestyle } from "@/components/sections/lifestyle";
import { MarqueeStrip } from "@/components/sections/marquee-strip";
import { Newsletter } from "@/components/sections/newsletter";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";
import { Provenance } from "@/components/sections/provenance";
import { Tagline } from "@/components/sections/tagline";

function ProductGridSkeleton() {
	return (
		<section className="bg-cream-section py-20 sm:py-28">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
				<div className="text-center mb-14">
					<div className="mx-auto h-7 w-40 bg-secondary/70 rounded animate-pulse mb-3" />
					<div className="mx-auto h-10 w-72 bg-secondary/70 rounded animate-pulse" />
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={`skeleton-${i}`}>
							<div className="aspect-square bg-secondary/70 rounded-sm mb-5 animate-pulse" />
							<div className="space-y-2 text-center">
								<div className="mx-auto h-6 w-2/3 bg-secondary/70 rounded animate-pulse" />
								<div className="mx-auto h-4 w-1/3 bg-secondary/70 rounded animate-pulse" />
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
			<MarqueeStrip />
			<Tagline />
			<FlavorRow />
			<Lifestyle />
			<Provenance />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid
					title="Shop the Flavors"
					eyebrow="Three sips, one ritual"
					description="Each can is a slow-pressed celebration of espresso and citrus, ready to chill and pour."
					limit={3}
				/>
			</Suspense>
			<Press />
			<Newsletter />
		</>
	);
}
