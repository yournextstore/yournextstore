import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";

/** Display name: `settings.storeName` when set (the API's `store.name` can be the slug). */
export async function getStoreName() {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	return me?.store.settings?.storeName || me?.store.name || "Your Next Store";
}

export async function getStoreDescription() {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	return me?.store.settings?.storeDescription || null;
}

type CollectionLike = { productCollections?: unknown[] | null; metafieldRules?: unknown };

/** A manual collection without members (or a rule collection without rules) would open an empty page. */
export function hasMembers(collection: CollectionLike) {
	const rules = collection.metafieldRules;
	return (collection.productCollections?.length ?? 0) > 0 || (Array.isArray(rules) && rules.length > 0);
}

/** Products with a photo and a price above zero first, so rows never open on a blank or $0 card. */
export function picturedFirst<T extends { images?: string[] | null; variants?: { price: string }[] | null }>(
	products: T[],
) {
	const ready = (product: T) =>
		(product.images?.length ?? 0) > 0 &&
		(product.variants ?? []).some((variant) => Number(variant.price) > 0);
	return [...products.filter(ready), ...products.filter((product) => !ready(product))];
}

/** Catalogue sizes for the home band: real numbers from the store, nothing invented. */
export async function getCatalogStats() {
	"use cache";
	cacheLife("minutes");
	const [products, catalog] = await Promise.all([
		commerce.productBrowse({ active: true, limit: 1 }).catch(() => ({ meta: { count: 0 } })),
		getNavCatalog(),
	]);
	return {
		products: products.meta.count,
		categories: catalog.categories.length,
		collections: catalog.collections.length,
	};
}

export type NavCategory = { id: string; slug: string; name: string };
export type NavCollection = { id: string; slug: string; name: string };

/** Top-level categories and collections, for the header menu, search select and footer. */
export async function getNavCatalog() {
	"use cache";
	cacheLife("hours");
	const [categories, collections, me] = await Promise.all([
		commerce.categoriesBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] })),
		commerce.collectionBrowse({ limit: 50 }).catch(() => ({ data: [] })),
		meGetCached().catch(() => null),
	]);
	const tools = me?.store.settings?.enabledTools;
	return {
		categories: categories.data
			.filter((c) => !c.parentId)
			.map((c): NavCategory => ({ id: c.id, slug: c.slug, name: c.name })),
		collections: collections.data
			.filter(hasMembers)
			.map((c): NavCollection => ({ id: c.id, slug: c.slug, name: c.name })),
		blog: tools?.blog ?? false,
		contact: tools?.contactForm ?? false,
	};
}
