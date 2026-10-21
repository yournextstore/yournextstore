import type { APIProductsBrowseResult } from "commerce-kit";
import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { isVideoUrl } from "@/lib/utils";

export type BrowseProduct = APIProductsBrowseResult["data"][number];

export { pad2 } from "@/lib/pad";

/** Flattens a TipTap document (or a plain string) into its visible text. */
export function richTextToPlain(value: unknown): string {
	if (typeof value === "string") return value;
	if (!value || typeof value !== "object") return "";
	const node = value as { type?: unknown; text?: unknown; content?: unknown };
	if (typeof node.text === "string") return node.text;
	const children = Array.isArray(node.content) ? node.content.map(richTextToPlain) : [];
	const inline = node.type === "paragraph" || node.type === "heading";
	return children
		.filter(Boolean)
		.join(inline ? "" : " ")
		.trim();
}

export const firstStill = (images: readonly string[] | null | undefined) =>
	images?.find((image) => !isVideoUrl(image)) ?? null;

export async function getStoreName() {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	return me?.store.settings?.storeName || me?.store.name || "Store";
}

/** One cached browse of the whole catalogue backs counts, picks and image fallbacks. */
export async function getCatalogProducts() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce
		.productBrowse({ active: true, limit: 100 })
		.catch(() => ({ data: [] as BrowseProduct[] }));
	return data;
}

export async function getCategories() {
	"use cache";
	cacheLife("minutes");
	const [categories, products] = await Promise.all([
		commerce.categoriesBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] })),
		getCatalogProducts(),
	]);
	return categories.data
		.filter((category) => !category.parentId)
		.map((category) => ({
			id: category.id,
			name: category.name,
			slug: category.slug,
			description: richTextToPlain(category.description),
			count: products.filter((product) => product.category?.id === category.id).length,
		}));
}

export async function getCollections() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.collectionBrowse({ active: true, limit: 20 }).catch(() => ({ data: [] }));
	// A manual collection without members opens an empty page: leave it out.
	const filled = data.filter(
		(c) => (c.productCollections?.length ?? 0) > 0 || (c.metafieldRules?.length ?? 0) > 0,
	);
	return filled.map((collection) => ({
		id: collection.id,
		name: collection.name,
		slug: collection.slug,
		image: collection.image ?? null,
		description: richTextToPlain(collection.description),
	}));
}

/** Price label for a product: a single price, or "from" the lowest when variants differ. */
export async function productPriceLabel(product: Pick<BrowseProduct, "variants">) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	if (!product.variants?.length) return null;
	const { min, max } = priceRange(product.variants, taxBehavior);
	if (max === 0n) return null;
	const label = formatMoney({ amount: min, currency, locale });
	return min !== max ? `From ${label}` : label;
}

/** Editorial photographs (Pexels, credited in NOTICE.md) for the home hero and the about page. */
export const EDITORIAL = {
	hero: { src: "/images/pexels/hero-bag-hooks.jpg", caption: "Arvo Lounge Chair, walnut" },
	wide: { src: "/images/pexels/about-concrete.jpg", caption: "The workshop bench" },
	portrait: { src: "/images/pexels/about-glasses.jpg", caption: "A hand-cut dovetail in oak" },
};
