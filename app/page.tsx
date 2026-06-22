import { Suspense } from "react";
import { Benefits } from "@/components/sections/benefits";
import { FounderStory } from "@/components/sections/founder-story";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";
import { StoreLocator } from "@/components/sections/store-locator";
import { UGCGrid } from "@/components/sections/ugc-grid";

function ProductGridSkeleton() {
	return (
		<section className="bg-background border-b-2 border-foreground/10">
			<div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-28">
				<div className="flex items-end justify-between mb-14">
					<div>
						<div className="h-3 w-24 bg-muted rounded animate-pulse mb-3" />
						<div className="h-10 w-72 bg-muted rounded animate-pulse" />
					</div>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={`skeleton-${i}`}>
							<div className="aspect-square bg-muted rounded-3xl mb-5 animate-pulse" />
							<div className="space-y-2">
								<div className="h-5 w-2/3 bg-muted rounded animate-pulse" />
								<div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
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
				<ProductGrid title="Pick your flavor" limit={6} />
			</Suspense>
			<Benefits />
			<FounderStory />
			<PressStrip />
			<UGCGrid />
			<div id="locator">
				<StoreLocator />
			</div>
			<Newsletter />
		</>
	);
}
