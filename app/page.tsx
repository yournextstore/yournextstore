import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { getCatalogStats, getCategories, getStoreName } from "@/lib/catalog";
import { getStoreConfig } from "@/lib/store-config";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

const pill =
	"inline-block rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:border-brand hover:text-brand";

export default async function Home() {
	// All cached reads: the home page prerenders whole, with no Suspense to shift the grid.
	const [storeName, stats, categories, config] = await Promise.all([
		getStoreName(),
		getCatalogStats(),
		getCategories(),
		getStoreConfig(),
	]);
	const ticker = ["New arrivals", ...categories.slice(0, 4).map((c) => c.name), "Curated collection"];

	return (
		<>
			<Marquee items={ticker} />
			<Hero storeName={storeName} stats={stats} money={config} />
			<div className="shop-container">
				<div className="border-t border-border" />
			</div>
			<ProductGrid kicker="Handpicked for you" title="New Arrivals" limit={8} />
			<Marquee items={ticker} inverted />
			{categories.length > 0 && (
				<section aria-labelledby="home-categories" className="shop-container py-16 md:py-20">
					<h2 id="home-categories" className="kicker mb-6">
						Browse by category
					</h2>
					<ul className="flex flex-wrap gap-3">
						<li>
							<Link href="/products" className={pill}>
								All Products
							</Link>
						</li>
						{categories.map((category) => (
							<li key={category.id}>
								<Link href={`/category/${category.slug}`} className={pill}>
									{category.name}
								</Link>
							</li>
						))}
					</ul>
				</section>
			)}
			<Newsletter />
		</>
	);
}
