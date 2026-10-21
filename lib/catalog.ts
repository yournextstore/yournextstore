import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { richTextToPlain } from "@/lib/display";

export async function getStoreName() {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	return me?.store.settings?.storeName || me?.store.name || "Your Next Store";
}

export async function getCategories() {
	"use cache";
	cacheLife("hours");
	const result = await commerce.categoriesBrowse({ active: true, limit: 100 }).catch(() => null);
	return (result?.data ?? []).map((category) => ({
		id: category.id,
		name: category.name,
		slug: category.slug,
		description: richTextToPlain(category.description),
		image: category.image,
	}));
}

export async function getCollections() {
	"use cache";
	cacheLife("hours");
	const result = await commerce.collectionBrowse({ limit: 100 }).catch(() => null);
	// A manual collection without members opens an empty page: leave it out.
	const filled = (result?.data ?? []).filter(
		(c) => (c.productCollections?.length ?? 0) > 0 || (c.metafieldRules?.length ?? 0) > 0,
	);
	return filled.map((collection) => ({
		id: collection.id,
		name: collection.name,
		slug: collection.slug,
		description: richTextToPlain(collection.description),
		image: collection.image,
	}));
}

/** Live numbers for the hero's stat column. */
export async function getCatalogStats() {
	"use cache";
	cacheLife("minutes");
	const [products, categories, collections] = await Promise.all([
		commerce.productBrowse({ active: true, limit: 100 }).catch(() => null),
		getCategories(),
		getCollections(),
	]);
	// The API's price ordering is unreliable, and free (0) variants would read "from $0".
	const priced = (products?.data ?? [])
		.flatMap((product) => product.variants)
		.filter((variant) => Number(variant.price) > 0)
		.sort((a, b) => Number(a.price) - Number(b.price));
	return {
		productCount: products?.meta.count ?? 0,
		cheapest: priced[0] ?? null,
		categoryCount: categories.length,
		collectionCount: collections.length,
	};
}
