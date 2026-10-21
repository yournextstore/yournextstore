import type { Metadata } from "next";
import { CategoryCards } from "@/components/sections/category-cards";
import { MembersBand } from "@/components/sections/members-band";
import { ProductFeatures } from "@/components/sections/product-features";
import { ProductGrid } from "@/components/sections/product-grid";
import { PromoBand } from "@/components/sections/promo-band";
import {
	getCatalogCategories,
	getFeaturedCollection,
	getHomeProducts,
	getStoreIdentity,
} from "@/lib/catalog";
import { EDITORIAL } from "@/lib/editorial";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default async function Home() {
	const [latest, categories, collection, identity] = await Promise.all([
		getHomeProducts(),
		getCatalogCategories(),
		getFeaturedCollection(),
		getStoreIdentity(),
	]);

	return (
		<>
			<PromoBand
				tall
				priority
				headingLevel={1}
				title="New arrivals are here"
				text={
					identity.storeDescription ??
					`Discover ${identity.storeName}: knitwear, shirts, trousers and coats in natural fibres, cut simply for every day.`
				}
				cta="Explore the shop"
				href="/products"
				images={EDITORIAL.hero}
			/>

			<CategoryCards categories={categories} />

			<ProductGrid
				title="New arrivals"
				description="The latest pieces from the studio."
				products={latest.slice(0, 4)}
				viewAllHref="/products"
				details
				className="pt-0 sm:pt-0"
			/>

			<div className="container-ae py-8">
				<PromoBand
					rounded
					title={collection?.name ?? "The full range"}
					text={collection?.description ?? "Every knit, shirt, trouser and coat in one place."}
					cta={collection ? "Explore the collection" : "Shop all products"}
					href={collection ? `/collection/${collection.slug}` : "/products"}
					images={EDITORIAL.collection}
				/>
			</div>

			<ProductFeatures
				title="Made to be worn"
				lead="A small wardrobe of basics: what we look for in every piece we make."
				heading="How we make clothes"
				description="Every piece starts with the fabric: merino, lambswool, cotton, linen and wool flannel, cut in simple shapes that work together. Fewer clothes, worn more often."
				points={[
					"Fabric, weight and fit on every product page, so you know what you are buying.",
					"A secure checkout with the payment methods you already use.",
					"An order confirmation in your inbox as soon as you buy.",
				]}
				images={EDITORIAL.features}
				href="/products"
				cta="Browse the shop"
			/>

			<MembersBand image={EDITORIAL.members} />
		</>
	);
}
