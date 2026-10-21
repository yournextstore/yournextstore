import type { APICollectionGetByIdResult, APIProductsBrowseResult } from "commerce-kit";
import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";
import { encodeVts } from "@/lib/vts";

export type MenuProduct = APIProductsBrowseResult["data"][number];

// The page has no pagination, so a smart collection renders one browse page. 100 is the API's max.
const SMART_COLLECTION_LIMIT = 100;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Collection and category descriptions can be TipTap JSON: flatten them to their text. */
export function plainText(value: unknown): string | null {
	if (typeof value === "string") {
		return value.trim() || null;
	}
	if (!value || typeof value !== "object") {
		return null;
	}
	const collect = (node: unknown): string[] => {
		if (!node || typeof node !== "object") return [];
		const text = "text" in node && typeof node.text === "string" ? [node.text] : [];
		const children = "content" in node && Array.isArray(node.content) ? node.content.flatMap(collect) : [];
		return [...text, ...children];
	};
	const text = collect(value).join(" ").replace(/\s+/g, " ").trim();
	return text || null;
}

// Only a `manual` collection keeps its members in the join table that `collectionGet` returns —
// the smart filters are evaluated against the whole catalog when the storefront asks for them.
// Re-expressing each one as the equivalent product browse is what keeps those collections from
// rendering as an empty grid. Cached like the collection itself, which also pins the
// `Date.now()` below to the cache entry.
export async function getCollectionProducts(collection: APICollectionGetByIdResult) {
	"use cache";
	cacheLife("minutes");
	const { filter } = collection;

	if (filter.type === "manual") {
		const ids = collection.productCollections.map((pc) => pc.product.id);
		// The SDK throws on a 404: one product deleted since it joined must not fail the page.
		return (
			await Promise.all(ids.map((id) => commerce.productGet({ idOrSlug: id }).catch(() => null)))
		).filter((product) => product !== null);
	}

	if (filter.type === "variantValues") {
		const { data } = await commerce.productBrowse({
			active: true,
			limit: SMART_COLLECTION_LIMIT,
			vts: encodeVts(filter.values),
		});
		return data;
	}

	if (filter.type === "dynamicPrice") {
		const { data } = await commerce.productBrowse({
			active: true,
			limit: SMART_COLLECTION_LIMIT,
			priceMin: filter.min ?? undefined,
			priceMax: filter.max ?? undefined,
		});
		return data;
	}

	const { data } = await commerce.productBrowse({
		active: true,
		limit: SMART_COLLECTION_LIMIT,
		orderBy: "createdAt",
		orderDirection: "desc",
	});

	// A rolling "new arrivals" window has no browse equivalent, so the age bound is applied here.
	if (typeof filter.days !== "number") {
		return data;
	}
	const cutoff = Date.now() - filter.days * MS_PER_DAY;
	return data.filter((product) => new Date(product.createdAt).getTime() >= cutoff);
}

export type MenuCategory = {
	id: string;
	name: string;
	/** Canonical path below /category, parents included. */
	path: string;
	description: string | null;
	productCount: number;
};

type Pictured = { images: string[]; variants: Array<{ images?: string[] | null }> };

const hasImage = (product: Pictured) =>
	product.images.length > 0 || product.variants.some((variant) => (variant.images ?? []).length > 0);

/** Photographed products first, keeping the store's order otherwise. */
export function picturedFirst<T extends Pictured>(products: T[]): T[] {
	return [...products.filter(hasImage), ...products.filter((product) => !hasImage(product))];
}

async function getCatalog() {
	"use cache";
	cacheLife("minutes");
	const [categories, products] = await Promise.all([
		commerce.categoriesBrowse({ active: true, limit: 100 }).catch(() => ({ data: [] })),
		commerce.productBrowse({ active: true, limit: 100 }).catch(() => ({ data: [] })),
	]);
	const byId = new Map(categories.data.map((category) => [category.id, category]));
	const rootOf = (id: string, depth = 0): string => {
		const parentId = byId.get(id)?.parentId;
		return parentId && byId.has(parentId) && depth < 3 ? rootOf(parentId, depth + 1) : id;
	};
	// A category page lists its subcategories' products too, so each top-level category is one
	// section holding everything below it (no one-card sections for a lone subcategory).
	const sections = categories.data
		.filter((category) => rootOf(category.id) === category.id)
		.map((category) => ({
			id: category.id,
			name: category.name,
			path: category.slug,
			description: plainText(category.description),
			products: picturedFirst(
				products.data.filter((product) => product.category && rootOf(product.category.id) === category.id),
			),
		}))
		.filter((section) => section.products.length > 0)
		.map((section) => ({ ...section, productCount: section.products.length }));
	return { sections, products: products.data };
}

/** Every top-level category that holds products (its subcategories' included), with its path and count. */
export async function getMenuCategories(): Promise<MenuCategory[]> {
	"use cache";
	cacheLife("minutes");
	const { sections } = await getCatalog();
	return sections.map(({ products: _products, ...category }) => category);
}

export type MenuSection = MenuCategory & { products: MenuProduct[] };

/** Every top-level category that holds products, in the store's category order, with its products. */
export async function getMenuSections(): Promise<MenuSection[]> {
	"use cache";
	cacheLife("minutes");
	const { sections } = await getCatalog();
	return sections;
}

/**
 * "Most loved": the store's best-sellers collection when it has one (any collection whose
 * slug or name says so), else its first collection that holds products, else the catalog;
 * photographed products first either way.
 */
export async function getMostOrdered(limit = 6) {
	"use cache";
	cacheLife("minutes");
	const collections = await commerce
		.collectionBrowse({ active: true, limit: 20 })
		.catch(() => ({ data: [] }));
	const ordered = [
		...collections.data.filter((collection) =>
			/best|popular|most/i.test(`${collection.slug} ${collection.name}`),
		),
		...collections.data,
	];
	for (const pick of ordered) {
		const collection = await commerce.collectionGet({ idOrSlug: pick.slug }).catch(() => null);
		const products = collection ? await getCollectionProducts(collection) : null;
		if (products && products.length > 0) {
			return picturedFirst<(typeof products)[number]>(products).slice(0, limit);
		}
	}
	const { products } = await getCatalog();
	return picturedFirst(products).slice(0, limit);
}
