import type { Metadata } from "next";
import { CategoryTiles } from "@/components/sections/categories";
import { Hero } from "@/components/sections/hero";
import { Offers } from "@/components/sections/offers";
import { ProductShelf } from "@/components/sections/product-shelf";
import { Promo } from "@/components/sections/promo";
import { capitalize, getCatalogCategories, getProductCount, getStoreIdentity } from "@/lib/catalog";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Every section reads cached data only, so the whole page lands in the prerendered shell
// without Suspense boundaries (a boundary around a cached section still streams and shifts).
export default async function Home() {
	const [identity, categories, count] = await Promise.all([
		getStoreIdentity(),
		getCatalogCategories(),
		getProductCount(),
	]);
	const top = categories[0];
	const offers = [
		{ name: "The shop", description: `${count} products to explore`, href: "/products" },
		{
			name: "Shop by category",
			description: `${categories.length} ${categories.length === 1 ? "category" : "categories"} to browse`,
			href: "#collections",
		},
		{ name: "Sign up for our newsletter", description: "Hear about new arrivals first", href: "#newsletter" },
	];

	return (
		<>
			<div className="flex flex-col border-b border-gray-200 lg:border-b-0">
				<Offers offers={offers} />
				<Hero description={identity.storeDescription} />
			</div>
			<ProductShelf
				title={top ? capitalize(top.name) : "New arrivals"}
				href={top ? `/category/${top.slug}` : "/products"}
				categorySlug={top?.slug ?? null}
			/>
			<Promo storeName={identity.storeName} />
			<CategoryTiles />
		</>
	);
}
