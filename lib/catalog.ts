import type { APICollectionGetByIdResult, APIProductsBrowseResult } from "commerce-kit";
import { cacheLife } from "next/cache";
import { try_ } from "safe-try";
import { commerce } from "@/lib/commerce";
import { tileFor } from "@/lib/editorial";
import { encodeVts } from "@/lib/vts";

// The page has no pagination, so a smart collection renders one browse page. 100 is the API's max.
const SMART_COLLECTION_LIMIT = 100;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type BrowseProduct = APIProductsBrowseResult["data"][number];

// The SDK throws on a 404 despite its `| null` type.
export async function getCollectionData(slug: string) {
	"use cache";
	cacheLife("minutes");
	const [error, collection] = await try_(commerce.collectionGet({ idOrSlug: slug }));
	return error ? null : collection;
}

// Only a `manual` collection keeps its members in the join table that `collectionGet` returns —
// the smart filters are evaluated against the whole catalog when the storefront asks for them.
// Re-expressing each one as the equivalent product browse keeps those collections from
// rendering as an empty grid. Cached, which also pins the `Date.now()` below to the entry.
export async function getCollectionProducts(collection: APICollectionGetByIdResult) {
	"use cache";
	cacheLife("minutes");
	const { filter } = collection;

	if (filter.type === "manual") {
		const ids = collection.productCollections.map((pc) => pc.product.id);
		// One product deleted since it joined must not fail the page.
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

/** A manual collection without members opens an empty page, so it is never linked. */
export function hasMembers(c: { productCollections?: unknown[] | null; metafieldRules?: unknown[] | null }) {
	return (c.productCollections?.length ?? 0) > 0 || (c.metafieldRules?.length ?? 0) > 0;
}

const TRENDING_SLUGS = ["bestsellers", "best-sellers", "featured", "trending", "top-picks"];
const TRENDING_COUNT = 7;

type Pickable = {
	images?: string[] | null;
	variants?: { price: string; images?: string[] | null }[];
};

const hasPhoto = (p: Pickable) =>
	(p.images?.length ?? 0) > 0 || (p.variants ?? []).some((v) => (v.images?.length ?? 0) > 0);
// A zero-priced bundle or set would read "$0.00" in a tile.
const hasPrice = (p: Pickable) => (p.variants ?? []).some((v) => Number(v.price) > 0);

/** Photographed, priced products first, keeping the store's order within each group. */
export function photographedFirst<T extends Pickable>(products: T[]) {
	const score = (p: T) => (hasPhoto(p) ? 0 : 2) + (hasPrice(p) ? 0 : 1);
	return products
		.map((product, index) => ({ product, index }))
		.sort((a, b) => score(a.product) - score(b.product) || a.index - b.index)
		.map(({ product }) => product);
}

/**
 * The original's "Trending Products" block: a title cell plus seven cards. A bestsellers-like
 * collection when the store has one, otherwise the store's products, photographed ones first.
 */
export async function getTrending() {
	"use cache";
	cacheLife("minutes");
	const { data: collections } = await commerce.collectionBrowse({ limit: 50 });
	const ref = collections.find((c) => TRENDING_SLUGS.includes(c.slug));
	if (ref) {
		const collection = await getCollectionData(ref.slug);
		const members = collection ? await getCollectionProducts(collection) : [];
		const products: (typeof members)[number][] = members;
		if (products.length > 0) {
			return {
				href: `/collection/${ref.slug}`,
				products: photographedFirst(products).slice(0, TRENDING_COUNT),
			};
		}
	}
	const { data } = await commerce.productBrowse({ active: true, limit: 24 });
	return { href: "/products", products: photographedFirst(data).slice(0, TRENDING_COUNT) };
}

export type CategoryTile = { name: string; href: string; image: string; position?: string };

/**
 * The original's "Categories" photo cards: the top-level categories, each on its own picture
 * when the store set one, otherwise on a bundled editorial photo.
 */
export async function getCategoryTiles(): Promise<CategoryTile[]> {
	"use cache";
	cacheLife("hours");
	const { data } = await commerce.categoriesBrowse({ limit: 50 });
	const top = data.filter((c) => !c.parentId);
	const tiles = (top.length >= 3 ? top : data).slice(0, 6);
	// Three per row on desktop: drop a trailing lone card.
	const count = tiles.length > 3 && tiles.length % 3 === 1 ? tiles.length - 1 : tiles.length;
	return tiles.slice(0, count).map((c, index) => {
		const fallback = tileFor(index);
		return {
			name: c.name,
			href: `/category/${c.slug}`,
			image: c.image ?? fallback.src,
			position: c.image ? undefined : fallback.position,
		};
	});
}

/** Top-level categories for the menu. */
export async function getTopCategories() {
	"use cache";
	cacheLife("hours");
	const { data } = await commerce.categoriesBrowse({ limit: 50 });
	return data.filter((c) => !c.parentId).map((c) => ({ name: c.name, slug: c.slug }));
}
