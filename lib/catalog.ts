import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";
import { displayPrice, type TaxBehavior } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";

/** One browse of the whole active catalogue, shared by the home sections and the categories page. */
export async function getCatalog() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({ active: true, limit: 100 });
	return data;
}

export type CategoryTile = {
	id: string;
	name: string;
	slug: string;
	image: string | null;
	count: number;
};

/** Categories pictured by their first product photo, with product counts (children included). */
export async function getCategoryTiles(): Promise<CategoryTile[]> {
	"use cache";
	cacheLife("minutes");
	const [{ data: categories }, products] = await Promise.all([
		commerce.categoriesBrowse({ active: true, limit: 50 }),
		getCatalog(),
	]);
	const familyOf = (id: string) => [id, ...categories.filter((c) => c.parentId === id).map((c) => c.id)];

	return categories
		.map((category) => {
			const family = familyOf(category.id);
			const members = products.filter((p) => p.categoryId && family.includes(p.categoryId));
			const pictured = members.find((p) => p.images.length > 0);
			return {
				id: category.id,
				name: category.name,
				slug: category.slug,
				image: category.image ?? pictured?.images[0] ?? null,
				count: members.length,
			};
		})
		.filter((tile) => tile.count > 0);
}

export type PromoBanner =
	| { kind: "deals"; percent: number; count: number }
	| { kind: "collection"; name: string; slug: string }
	| { kind: "catalog"; count: number };

/** A manual collection without members opens an empty page, so it is never linked. */
export function hasMembers(c: { productCollections?: unknown[] | null; metafieldRules?: unknown[] | null }) {
	return (c.productCollections?.length ?? 0) > 0 || (c.metafieldRules?.length ?? 0) > 0;
}

type Pickable = { images?: string[] | null; variants?: { price: string; images?: string[] | null }[] };

const hasPhoto = (p: Pickable) =>
	(p.images?.length ?? 0) > 0 || (p.variants ?? []).some((v) => (v.images?.length ?? 0) > 0);
// A zero-priced bundle or set would read "$0.00" on a tile.
const hasPrice = (p: Pickable) => (p.variants ?? []).some((v) => Number(v.price) > 0);

/** Photographed, priced products first, keeping the store's order within each group. */
export function photographedFirst<T extends Pickable>(products: T[]) {
	const score = (p: T) => (hasPhoto(p) ? 0 : 2) + (hasPrice(p) ? 0 : 1);
	return products
		.map((product, index) => ({ product, index }))
		.sort((a, b) => score(a.product) - score(b.product) || a.index - b.index)
		.map(({ product }) => product);
}

type Browsed = Awaited<ReturnType<typeof getCatalog>>[number];

/** Largest real discount (whole percent) a product carries, or 0. */
export function discountPercent(product: Browsed, taxBehavior: TaxBehavior) {
	const percents = product.variants.map((variant) => {
		const price = Number(displayPrice(variant, taxBehavior));
		const list = Number(displayPrice(variant, taxBehavior, "originalPrice") ?? price);
		return list > price ? Math.round(((list - price) / list) * 100) : 0;
	});
	return Math.max(0, ...percents);
}

export async function getDiscountedProducts() {
	"use cache";
	cacheLife("minutes");
	const [products, { taxBehavior }] = await Promise.all([getCatalog(), getStoreConfig()]);
	return products.filter((product) => discountPercent(product, taxBehavior) > 0);
}

/**
 * The green banner. It advertises a sale only when products actually carry a lower price
 * than their list price (the percent is the largest real discount); otherwise it points
 * at a collection (or the whole catalogue), so the copy never promises an offer the store has not set.
 */
export async function getPromoBanner(): Promise<PromoBanner | null> {
	"use cache";
	cacheLife("minutes");
	const [discounted, { taxBehavior }, { data: collections }] = await Promise.all([
		getDiscountedProducts(),
		getStoreConfig(),
		commerce.collectionBrowse({ limit: 10 }),
	]);
	if (discounted.length > 0) {
		const percent = Math.max(...discounted.map((product) => discountPercent(product, taxBehavior)));
		return { kind: "deals", percent, count: discounted.length };
	}

	const filled = collections.filter(hasMembers);
	const collection = filled.find((c) => c.image) ?? filled[0];
	if (!collection) {
		const catalog = await getCatalog();
		return catalog.length > 0 ? { kind: "catalog", count: catalog.length } : null;
	}
	return { kind: "collection", name: collection.name, slug: collection.slug };
}
