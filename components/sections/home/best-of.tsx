import { ProductCard } from "@/components/product-card";
import { ProductRail, type RailTab } from "@/components/product-rail";
import { BrandName } from "@/components/wordmark";
import { getCollections, getProducts, getStoreInfo, picturedFirst } from "@/lib/catalog";

/** "Best of CoreX Nutrition": tabbed product carousel (all products, then each non-empty collection). */
export async function BestOf() {
	const [{ storeName }, newest, collections] = await Promise.all([
		getStoreInfo(),
		getProducts(24),
		getCollections(),
	]);
	const products = picturedFirst(newest).slice(0, 9);
	if (products.length === 0) return null;
	const tabs: RailTab[] = [
		{
			key: "all",
			label: "Best sellers",
			items: products.map((product) => <ProductCard key={product.id} product={product} />),
		},
		...collections
			.filter((c) => c.products.length > 0)
			.slice(0, 3)
			.map((c) => ({
				key: c.slug,
				label: c.name,
				items: picturedFirst(c.products)
					.slice(0, 9)
					.map((product) => <ProductCard key={product.id} product={product} />),
			})),
	];
	return (
		<section aria-labelledby="best-of" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
			<h2 id="best-of" className="section-title mb-10 text-center text-[2rem] text-ink lg:text-heading-xl">
				Best <span className="stroke-word">of</span> <BrandName name={storeName} className="normal-case" />
			</h2>
			<ProductRail tabs={tabs} label="Product groups" />
		</section>
	);
}
