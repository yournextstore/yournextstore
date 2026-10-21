import type { Metadata } from "next";
import Link from "next/link";
import { CollectionsShelf } from "@/components/sections/collections-shelf";
import { FeaturedCollection } from "@/components/sections/featured-collection";
import { Hero } from "@/components/sections/hero";
import { ProductGrid } from "@/components/sections/product-grid";
import { StoreQuote } from "@/components/sections/store-quote";
import { Values } from "@/components/sections/values";
import { getTopCategories } from "@/lib/catalog";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

/** The quiet strip under the hero: the store's top-level categories as underlined links. */
async function CategoryStrip() {
	const categories = await getTopCategories();
	if (categories.length === 0) return null;
	return (
		<div className="border-y border-line bg-tile/50">
			<nav
				aria-label="Categories"
				className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-5 gap-y-1 px-5 py-2.5 text-[13px] text-muted-foreground"
			>
				<span>Browse by category:</span>
				{categories.slice(0, 6).map((category) => (
					<Link
						key={category.id}
						href={`/category/${category.slug}`}
						className="inline-flex min-h-6 items-center font-semibold text-ink underline underline-offset-4 hover:text-pine-ink"
					>
						{category.name}
					</Link>
				))}
			</nav>
		</div>
	);
}

// Every section is cached and rendered without its own Suspense boundary: a boundary
// around a cached section still streams it after the first flush and shifts the layout.
export default function Home() {
	return (
		<>
			<Hero />
			<CategoryStrip />
			<CollectionsShelf />
			<ProductGrid title="In the shop" limit={8} showViewAll />
			<Values />
			<StoreQuote />
			<FeaturedCollection />
		</>
	);
}
