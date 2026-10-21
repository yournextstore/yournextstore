import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import {
	DetailStory,
	Overview,
	ProductPanels,
	Promises,
	ShopSheet,
	Statement,
} from "@/components/sections/home-sections";
import { PurchaseCard } from "@/components/sections/purchase-card";
import { getHomeData } from "@/lib/catalog";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// One cached read feeds every section, so the whole page is part of the prerendered shell
// (no Suspense boundary to stream in after first paint and shift the layout).
export default async function Home() {
	const { storeName, products, productCount, collections, featured, featuredPrice, priceFrom, shipping } =
		await getHomeData();
	const panels = products.filter((product) => product.id !== featured?.id).slice(0, 4);
	const cells = [
		{ label: "Products in the shop", value: String(productCount) },
		...(collections.length > 0
			? [{ label: "Collections", value: collections.map((collection) => collection.name).join(" · ") }]
			: []),
		...(priceFrom ? [{ label: "Prices from", value: priceFrom }] : []),
		{ label: "Delivery", value: shipping ?? "Calculated at checkout" },
		...(featured ? [{ label: "Featured pair", value: featured.name }] : []),
		{ label: "Checkout", value: "Hosted · cards and wallets" },
	];

	return (
		<>
			<Hero
				featured={featured}
				price={featuredPrice}
				facts={[
					...(shipping ? [shipping] : []),
					`${productCount} ${productCount === 1 ? "product" : "products"} in the shop`,
				]}
			/>
			<Overview collections={collections} />
			<DetailStory />
			<ProductPanels products={panels} />
			<Promises shipping={shipping} />
			<ShopSheet cells={cells} />
			{featured && featured.variants.length > 0 && (
				<section id="purchase" className="border-t border-hairline px-6 py-28 md:px-12 md:py-40">
					<PurchaseCard
						product={{
							id: featured.id,
							name: featured.name,
							slug: featured.slug,
							images: featured.images,
							summary: featured.summary ?? null,
						}}
						variants={featured.variants}
						perks={[shipping ?? "Delivery options at checkout", "Secure checkout", "Cards and wallets"]}
					/>
				</section>
			)}
			<Statement storeName={storeName} />
		</>
	);
}
