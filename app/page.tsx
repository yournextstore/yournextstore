import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { CollabBanner } from "@/components/sections/collab-banner";
import { Drops } from "@/components/sections/drops";
import { Hero } from "@/components/sections/hero";
import { Lookbook } from "@/components/sections/lookbook";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { WordmarkChain } from "@/components/sections/wordmark-chain";

function ProductGridSkeleton() {
	return (
		<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-14 sm:py-20 border-b-2 border-foreground">
			<div className="flex items-end justify-between mb-10">
				<div>
					<div className="h-4 w-32 bg-secondary animate-pulse mb-3" />
					<div className="h-10 w-64 bg-secondary animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-secondary border-2 border-foreground mb-3 animate-pulse" />
						<div className="space-y-2">
							<div className="h-4 w-3/4 bg-secondary animate-pulse" />
							<div className="h-4 w-1/4 bg-secondary animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

function DropsSkeleton() {
	return (
		<section className="border-b-2 border-foreground bg-background">
			<div className="grid lg:grid-cols-2">
				<div className="yns-bg-lime p-8 sm:p-16 min-h-[400px]" />
				<div className="grid grid-cols-2 grid-rows-2 min-h-[400px]">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={`drops-skel-${i}`} className="bg-secondary border border-foreground animate-pulse" />
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
			<CollabBanner />
			<Suspense fallback={<DropsSkeleton />}>
				<Drops />
			</Suspense>
			<Lookbook />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="The Catalog" eyebrow="New Releases" limit={6} />
			</Suspense>
			<About />
			<WordmarkChain />
			<Newsletter />
		</>
	);
}
