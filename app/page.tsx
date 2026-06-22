import { Suspense } from "react";
import { Benefits } from "@/components/sections/benefits";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";
import { Source } from "@/components/sections/source";
import { StoryRow } from "@/components/sections/story-row";
import { TestResults } from "@/components/sections/test-results";

function ProductGridSkeleton() {
	return (
		<section className="bg-yns-cream">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-28">
				<div className="mb-14">
					<div className="h-3 w-24 bg-foreground/10 rounded animate-pulse" />
					<div className="mt-4 h-10 w-72 bg-foreground/10 rounded animate-pulse" />
				</div>
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
					{Array.from({ length: 8 }).map((_, i) => (
						<div key={`sk-${i}`}>
							<div className="aspect-[4/5] bg-foreground/5 rounded-sm mb-5 animate-pulse" />
							<div className="h-4 w-3/4 mx-auto bg-foreground/10 rounded animate-pulse" />
							<div className="mt-2 h-3 w-1/3 mx-auto bg-foreground/10 rounded animate-pulse" />
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
			<StoryRow />
			<Benefits />
			<TestResults />
			<Source />
			<Press />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid
					title="Shop the lineup"
					description="Still, sparkling, and flavored — each in returnable glass."
					eyebrow="Our Water"
					background="cream"
					limit={8}
				/>
			</Suspense>
			<Newsletter />
		</>
	);
}
