import type { Metadata } from "next";
import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { CategoryChips } from "@/components/sections/category-chips";
import { EditorialBreak } from "@/components/sections/editorial-break";
import { FeaturedCollection } from "@/components/sections/featured-collection";
import { Hero } from "@/components/sections/hero";
import { MaterialCraft } from "@/components/sections/material-craft";
import { Newsletter } from "@/components/sections/newsletter";
import { PressLogos } from "@/components/sections/press-logos";
import { ProductGrid } from "@/components/sections/product-grid";
import { isPreview } from "@/lib/demo-products";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function ProductGridSkeleton({ columns = 4 }: { columns?: 3 | 4 }) {
	const cls =
		columns === 4 ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
	return (
		<section className="bg-cream py-16 sm:py-24">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-12">
					<div className="h-3 w-32 bg-sand rounded animate-pulse mb-3" />
					<div className="h-10 w-72 bg-sand rounded animate-pulse" />
				</div>
				<div className={`grid ${cls} gap-x-5 gap-y-10`}>
					{Array.from({ length: columns === 4 ? 8 : 6 }).map((_, i) => (
						<div key={`skeleton-${i}`}>
							<div className="aspect-[4/5] bg-sand rounded-md mb-4 animate-pulse" />
							<div className="space-y-2">
								<div className="h-5 w-3/4 bg-sand rounded animate-pulse" />
								<div className="h-3 w-1/3 bg-sand rounded animate-pulse" />
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
	const params = await searchParams;
	const preview = await isPreview(params);
	if (preview) {
		return {
			robots: { index: false, follow: false },
		};
	}
	return {};
}

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
	const params = await searchParams;
	const preview = await isPreview(params);

	return (
		<main>
			<Hero isPreview={preview} />
			<CategoryChips isPreview={preview} />
			<FeaturedCollection isPreview={preview} />
			<EditorialBreak isPreview={preview} />
			<Suspense fallback={<ProductGridSkeleton columns={4} />}>
				<ProductGrid
					eyebrow="Shelf favorites"
					title="Best sellers"
					description="What our regulars keep returning for, season after season."
					limit={8}
					columns={4}
					isPreview={preview}
				/>
			</Suspense>
			<MaterialCraft />
			<PressLogos />
			<About isPreview={preview} />
			<Newsletter />
		</main>
	);
}
