import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { isVideoUrl } from "@/lib/utils";

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

export async function getStoreIdentity() {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	const settings = me?.store.settings;
	return {
		storeName: settings?.storeName || me?.store.name || "Your Next Store",
		storeDescription: settings?.storeDescription || null,
		blogEnabled: settings?.enabledTools?.blog ?? false,
		contactFormEnabled: settings?.enabledTools?.contactForm ?? false,
	};
}

// One browse of the catalog backs every "no image of its own" fallback.
async function getCatalogProducts() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({ active: true, limit: 100 }).catch(() => ({ data: [] }));
	return data;
}

const firstStill = (images: readonly string[] | null | undefined) =>
	images?.find((image) => !isVideoUrl(image)) ?? null;

export type CollectionTile = {
	id: string;
	name: string;
	href: string;
	image: string | null;
	description: string;
};

/** Active collections that hold products, each pictured by its own image or, failing that, its first product's. */
export async function getCollectionTiles(limit = 50): Promise<CollectionTile[]> {
	"use cache";
	cacheLife("minutes");
	const [collections, products] = await Promise.all([
		commerce.collectionBrowse({ limit: 100 }).catch(() => ({ data: [] })),
		getCatalogProducts(),
	]);
	return collections.data
		.filter(
			(collection) =>
				collection.active &&
				(collection.productCollections.length > 0 || (collection.metafieldRules?.length ?? 0) > 0),
		)
		.map((collection) => {
			const memberIds = new Set(collection.productCollections.map((pc) => pc.productId));
			const product = products.find((p) => memberIds.has(p.id));
			return {
				id: collection.id,
				name: collection.name,
				href: `/collection/${collection.slug}`,
				image: collection.image ?? firstStill(product?.images),
				description: richTextToPlain(collection.description),
			};
		})
		.slice(0, limit);
}

/** Editorial photographs (Pexels, see NOTICE.md) for the full-bleed blocks on home and About. */
export const editorialImages = {
	home: {
		src: "/images/pexels/sneakers-steps.jpg",
		alt: "A cobalt side table and a red dome lamp in a white room with a yellow wall",
	},
	about: {
		src: "/images/pexels/tote-street.jpg",
		alt: "Brightly powder-coated steel sheets and parts stacked in a white workshop",
	},
} as const;

/** Active products, the ones with a photograph first, so image-led rows never open on a blank frame. */
export async function getPicturedFirstProducts(limit: number) {
	"use cache";
	cacheLife("minutes");
	const products = await getCatalogProducts();
	const pictured = products.filter((p) => firstStill(p.images));
	const rest = products.filter((p) => !firstStill(p.images));
	return [...pictured, ...rest].slice(0, limit);
}

export async function getTopCategories() {
	"use cache";
	cacheLife("hours");
	const result = await commerce.categoriesBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] }));
	return result.data
		.filter((category) => !category.parentId)
		.map((category) => ({ href: `/category/${category.slug}`, label: category.name }));
}
