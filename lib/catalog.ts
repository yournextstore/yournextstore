import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";

export async function getStoreName() {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	return me?.store.settings?.storeName || me?.store.name || "Store";
}

export async function getStoreLogo() {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	const logo = me?.store.settings?.logo;
	return (typeof logo === "string" ? logo : logo?.imageUrl) || null;
}

/** Top-level categories, each pictured by its first product's photo (categories carry no images). */
export async function getCategoryCards() {
	"use cache";
	cacheLife("hours");
	const [categories, products] = await Promise.all([
		commerce.categoriesBrowse({ limit: 50 }),
		commerce.productBrowse({ active: true, limit: 100 }),
	]);
	return categories.data
		.filter((category) => category.active && !category.parentId)
		.map((category) => {
			const inCategory = products.data.filter((product) => product.category?.id === category.id);
			return {
				id: category.id,
				name: category.name,
				slug: category.slug,
				image: category.image || inCategory.find((product) => product.images[0])?.images[0] || null,
				count: inCategory.length,
			};
		})
		.filter((category) => category.count > 0);
}

/** Hero photograph bundled with the theme (Pexels, see NOTICE.md). */
export const HERO_IMAGE = "/images/pexels/boutique.jpg";
