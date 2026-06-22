import type { Metadata } from "next";
import { Suspense } from "react";
import { CollectionRow } from "@/components/sections/collection-row";
import { CraftStrip } from "@/components/sections/craft-strip";
import { EditorialSplit } from "@/components/sections/editorial-split";
import { FounderNote } from "@/components/sections/founder-note";
import { FragranceFamilyGrid } from "@/components/sections/fragrance-family-grid";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { PressMarquee } from "@/components/sections/press-marquee";
import { ProductGrid } from "@/components/sections/product-grid";
import { isPreview } from "@/lib/demo-products";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
	const preview = await isPreview(await searchParams);
	if (preview) {
		return { robots: { index: false, follow: false } };
	}
	return {};
}

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
			<div className="text-center mb-16">
				<div className="h-3 w-24 bg-secondary rounded animate-pulse mx-auto mb-4" />
				<div className="h-10 w-72 bg-secondary rounded animate-pulse mx-auto" />
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[4/5] bg-secondary rounded-sm mb-5 animate-pulse" />
						<div className="space-y-2 text-center">
							<div className="h-5 w-3/4 bg-secondary rounded animate-pulse mx-auto" />
							<div className="h-4 w-1/4 bg-secondary rounded animate-pulse mx-auto" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
	const preview = await isPreview(await searchParams);

	return (
		<main>
			<Hero preview={preview} />
			<CollectionRow preview={preview} />
			<EditorialSplit preview={preview} />
			<CraftStrip />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid
					title="The current collection"
					eyebrow="New Arrivals"
					description="Édition Hiver — eight new fragrances released in numbered batches of 250 each."
					limit={6}
					preview={preview}
				/>
			</Suspense>
			<PressMarquee />
			<FragranceFamilyGrid preview={preview} />
			<FounderNote />
			<Newsletter />
		</main>
	);
}
