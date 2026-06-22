import { Suspense } from "react";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { Hero } from "@/components/sections/hero";
import { Manifesto } from "@/components/sections/manifesto";
import { Newsletter } from "@/components/sections/newsletter";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";
import { ProductStory } from "@/components/sections/product-story";

function ProductGridSkeleton() {
	return (
		<section className="bg-[color:var(--color-yns-cream)]">
			<div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-28">
				<div className="mb-12 border-b border-[color:var(--color-yns-ink)]/15 pb-8">
					<div className="h-3 w-32 bg-[color:var(--color-yns-bone)] animate-pulse mb-4" />
					<div className="h-14 w-2/3 bg-[color:var(--color-yns-bone)] animate-pulse" />
				</div>
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[color:var(--color-yns-ink)]/10 border border-[color:var(--color-yns-ink)]/10">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={`skeleton-${i}`} className="bg-[color:var(--color-yns-cream)] p-3 sm:p-5">
							<div className="aspect-square bg-[color:var(--color-yns-bone)] animate-pulse mb-4" />
							<div className="h-4 w-2/3 bg-[color:var(--color-yns-bone)] animate-pulse" />
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
			<ProductStory />
			<FeatureGrid />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="The Collection" description="Field-tested, workshop-built." limit={8} />
			</Suspense>
			<Manifesto />
			<Press />
			<Newsletter />
		</>
	);
}
