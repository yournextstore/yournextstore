import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
import { formatMoney } from "@/lib/money";
import { getStoreConfig } from "@/lib/store-config";
import { isVideoUrl } from "@/lib/utils";

/** Bundled generated photographs (see NOTICE.md) for the editorial slots: hero slides, menu, listing header. */
export const EDITORIAL = {
	hero: ["/images/pexels/hero-knits.jpg", "/images/pexels/hero-tote.jpg", "/images/pexels/hero-rack.jpg"],
	listing: "/images/pexels/products-wardrobe.jpg",
	menu: "/images/pexels/menu-hoodies.jpg",
} as const;

/** A manual collection with no members (or a smart one with no rules) would open on an empty grid. */
const hasMembers = (c: { productCollections?: unknown[] | null; metafieldRules?: unknown[] | null }) =>
	(c.productCollections?.length ?? 0) > 0 || (c.metafieldRules?.length ?? 0) > 0;

/** The store's own free-shipping threshold, formatted ("$100"), or null when it has none. */
export async function getFreeShipping() {
	"use cache";
	cacheLife("hours");
	const [me, { currency, locale }] = await Promise.all([meGetCached().catch(() => null), getStoreConfig()]);
	const threshold = Number(me?.store.settings?.freeShippingThreshold ?? 0);
	return threshold > 0
		? formatMoney({ amount: BigInt(threshold), currency, locale }).replace(/\.00(?=\D*$)/, "")
		: null;
}

export type NavEntry = { slug: string; name: string; image: string | null; description: string };

/** Flattens a TipTap JSON description (or a plain string) into one line of text. */
export function richText(value: unknown): string {
	if (typeof value === "string") return value;
	if (!value || typeof value !== "object") return "";
	const parts: string[] = [];
	const walk = (node: unknown) => {
		if (!node || typeof node !== "object") return;
		if ("text" in node && typeof node.text === "string") parts.push(node.text);
		if ("content" in node && Array.isArray(node.content)) {
			for (const child of node.content) walk(child);
			parts.push(" ");
		}
	};
	walk(value);
	return parts.join("").replace(/\s+/g, " ").trim();
}

export async function getShopName() {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	return me?.store.settings?.storeName || me?.store.name || "Your Next Store";
}

/**
 * Everything the header, menus and home sections need from the catalogue in one cached call.
 * `pool` holds one still image per product, in browse order; slots that need a picture and have
 * none of their own take `pool[i % pool.length]`, so even a one-image store fills every slot.
 */
export async function getCatalog() {
	"use cache";
	cacheLife("minutes");

	const [products, collections, facets] = await Promise.all([
		commerce.productBrowse({ active: true, limit: 100 }),
		commerce.collectionBrowse({ limit: 100 }),
		getFilterFacets(),
	]);

	const pool = products.data
		.map((product) => product.images?.find((url) => !isVideoUrl(url)))
		.filter((url): url is string => Boolean(url));
	const pick = (i: number) => (pool.length > 0 ? (pool[i % pool.length] ?? null) : null);

	const collectionEntries: NavEntry[] = collections.data.filter(hasMembers).map((collection, i) => ({
		slug: collection.slug,
		name: collection.name,
		image: collection.image ?? pick(i),
		description: richText(collection.description) || `Shop the ${collection.name} collection.`,
	}));

	// Each department shows a photo of one of its own products; departments with no photographed
	// product (empty, or variant-only images) stay out of the menus and the browse grid.
	const categoryEntries: NavEntry[] = facets.categories.flatMap((category) => {
		const image = products.data
			.find((p) => p.category?.slug === category.slug && p.images?.some((url) => !isVideoUrl(url)))
			?.images?.find((url) => !isVideoUrl(url));
		return image
			? [
					{
						slug: category.slug,
						name: category.name,
						image,
						description: `Browse everything in ${category.name}.`,
					},
				]
			: [];
	});

	return {
		pool,
		productCount: products.meta.count,
		collections: collectionEntries,
		categories: categoryEntries,
	};
}
