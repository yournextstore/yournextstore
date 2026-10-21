import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";

/** Flattens a TipTap/ProseMirror document (or a plain string) to its text. */
export function plainText(value: unknown): string {
	if (typeof value === "string") return value;
	if (!value || typeof value !== "object") return "";
	const node = value as { text?: unknown; content?: unknown };
	const own = typeof node.text === "string" ? node.text : "";
	const children = Array.isArray(node.content) ? node.content.map(plainText).join(" ") : "";
	return `${own}${children}`.replace(/\s+/g, " ").trim();
}

/** Store name, its initial for the round mark, and a short hand-lettered tagline. */
export async function getStoreBrand() {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	const name = me?.store.settings?.storeName || me?.store.name || "Your Next Store";
	const description = me?.store.settings?.storeDescription?.trim() || "";
	return {
		name,
		initial: name.trim().charAt(0).toUpperCase() || "Y",
		// The original sets a short script line under the wordmark; a long description won't fit there.
		tagline: description && description.length <= 42 ? description : "Small trees for patient hands",
		description: description || null,
	};
}

/**
 * Photographs for the editorial slots (hero, polaroid, side photo, about). Bundled editorial photos
 * (see NOTICE.md), so the scrapbook mood holds whatever the catalogue looks like; product cards,
 * pages and the basket keep the store's own pictures.
 */
export const EDITORIAL = {
	hero: "/images/pexels/eg-hero-room.jpg",
	polaroid: "/images/pexels/eg-tote-chair.jpg",
	side: "/images/pexels/eg-rail-bedroom.jpg",
	story: "/images/pexels/eg-hat-book.jpg",
} as const;

type CollectionLike = { productCollections?: unknown[] | null; metafieldRules?: unknown };

/** A manual collection with no members (or a rule collection with no rules) would open an empty page. */
export function hasMembers(collection: CollectionLike): boolean {
	const rules = collection.metafieldRules;
	return (collection.productCollections?.length ?? 0) > 0 || (Array.isArray(rules) && rules.length > 0);
}

/** Collections worth linking to from menus, chips and bands. */
export async function getLinkableCollections(limit: number) {
	"use cache";
	cacheLife("hours");
	const { data } = await commerce.collectionBrowse({ limit: 50 }).catch(() => ({ data: [] }));
	return data.filter(hasMembers).slice(0, limit);
}

/** Products with a photo and a price first, so rails don't open on an empty card or a $0 set. */
export function picturedFirst<T extends { images?: string[] | null; variants?: { price: string }[] | null }>(
	products: T[],
): T[] {
	const ready = (p: T) => (p.images?.length ?? 0) > 0 && (p.variants ?? []).some((v) => Number(v.price) > 0);
	return [...products.filter(ready), ...products.filter((p) => !ready(p))];
}

/**
 * Notes for the home band: collections that have products, topped up with top-level categories
 * so a store with one collection still fills the stack. Each gets a product photo and a count.
 */
export async function getCollectionNotes(limit = 3) {
	"use cache";
	cacheLife("hours");
	const [collections, products] = await Promise.all([
		commerce.collectionBrowse({ limit: 50 }).catch(() => ({ data: [] })),
		commerce.productBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] })),
	]);
	const pictured = picturedFirst(products.data);
	const imageById = new Map(products.data.map((p) => [p.id, p.images?.[0] ?? null]));

	const fromCollections = collections.data.filter(hasMembers).map((collection) => {
		const memberIds = (collection.productCollections ?? []).map((pc) => pc.productId);
		const memberImage = memberIds.map((id) => imageById.get(id)).find((src) => !!src) ?? null;
		return {
			id: collection.id,
			href: `/collection/${collection.slug}`,
			name: collection.name,
			image: collection.image ?? memberImage,
			count: memberIds.length,
			text: plainText(collection.description),
		};
	});

	const categories = new Map<
		string,
		{ id: string; slug: string; name: string; count: number; image: string | null }
	>();
	for (const product of pictured) {
		const category = product.category;
		if (!category || category.parentId) continue;
		const entry = categories.get(category.id) ?? {
			id: category.id,
			slug: category.slug,
			name: category.name,
			count: 0,
			image: null,
		};
		categories.set(category.id, {
			...entry,
			count: entry.count + 1,
			image: entry.image ?? product.images?.[0] ?? null,
		});
	}
	const fromCategories = [...categories.values()]
		.sort((a, b) => b.count - a.count)
		.map((c) => ({
			id: c.id,
			href: `/category/${c.slug}`,
			name: c.name,
			image: c.image,
			count: c.count,
			text: "",
		}));

	return [...fromCollections, ...fromCategories].slice(0, limit);
}
