import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { CollectionTiles } from "@/components/sections/collection-tiles";
import { Craftsmanship } from "@/components/sections/craftsmanship";
import { Hero } from "@/components/sections/hero";
import { Journal } from "@/components/sections/journal";
import { Newsletter } from "@/components/sections/newsletter";
import { PressLogos } from "@/components/sections/press-logos";
import { ProductGrid } from "@/components/sections/product-grid";
import { Trial } from "@/components/sections/trial";

function CollectionTilesSkeleton() {
	return (
		<section className="bg-[var(--cream)]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="h-10 w-64 bg-[var(--secondary)] yns-image-shimmer mb-10" />
				<div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-7">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={`tile-skel-${i}`}>
							<div className="aspect-[4/5] bg-[var(--secondary)] yns-image-shimmer" />
							<div className="mt-4 h-6 w-1/2 bg-[var(--secondary)] yns-image-shimmer" />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function ProductGridSkeleton() {
	return (
		<section className="bg-[var(--cream)]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="mb-12">
					<div className="h-3 w-24 bg-[var(--secondary)] yns-image-shimmer mb-4" />
					<div className="h-10 w-72 bg-[var(--secondary)] yns-image-shimmer" />
				</div>
				<div className="grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 lg:gap-12">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={`p-skel-${i}`}>
							<div className="aspect-[4/5] bg-[var(--secondary)] yns-image-shimmer" />
							<div className="mt-5 h-5 w-3/4 bg-[var(--secondary)] yns-image-shimmer" />
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
			<About />
			<Suspense fallback={<CollectionTilesSkeleton />}>
				<CollectionTiles />
			</Suspense>
			<Craftsmanship />
			<PressLogos />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Bench-made this season" eyebrow="Featured goods" limit={6} />
			</Suspense>
			<Trial />
			<Journal />
			<Newsletter />
		</>
	);
}
