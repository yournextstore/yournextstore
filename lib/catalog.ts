import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";
import { isVideoUrl } from "@/lib/utils";

/** Flattens a TipTap document (or a plain string) into its visible text. */
export function richTextToPlain(value: unknown): string {
	if (typeof value === "string") return value.trim();
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

/** Active collections that can show products: a manual one with no members would open on an empty page. */
export const isListedCollection = (collection: {
	active: boolean;
	productCollections: readonly unknown[];
	metafieldRules?: readonly unknown[] | null;
}) =>
	collection.active &&
	(collection.productCollections.length > 0 || (collection.metafieldRules?.length ?? 0) > 0);

export const firstStill = (images: readonly string[] | null | undefined) =>
	images?.find((image) => !isVideoUrl(image)) ?? null;

/** One cached browse of the catalog backs every home section that needs products or a fallback image. */
export async function getCatalogProducts() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({ active: true, limit: 24 }).catch(() => ({ data: [] }));
	return picturedFirst(data);
}

type Pictured = {
	images?: readonly string[] | null;
	variants?: readonly { images?: readonly string[] | null }[];
};

const isPictured = (product: Pictured) =>
	Boolean(firstStill(product.images) ?? product.variants?.map((v) => firstStill(v.images)).find(Boolean));

/** Products with a photograph (their own or a variant's) first, the rest after; order otherwise kept. */
export function picturedFirst<T extends Pictured>(products: readonly T[]): T[] {
	return [...products.filter(isPictured), ...products.filter((product) => !isPictured(product))];
}

export async function getNewestProduct() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce
		.productBrowse({ active: true, limit: 8, orderBy: "createdAt", orderDirection: "desc" })
		.catch(() => ({ data: [] }));
	// A pictured product with a real price (a free bundle or sample would read oddly as the headline).
	const priced = (product: (typeof data)[number]) => product.variants.some((v) => BigInt(v.price) > 0n);
	return (
		data.find((product) => firstStill(product.images) && priced(product)) ??
		data.find((product) => firstStill(product.images)) ??
		null
	);
}

export type CollectionTile = {
	id: string;
	name: string;
	href: string;
	image: string;
	description: string;
	productIds: string[];
};

/** Active collections, each pictured by its own image or, failing that, its first product's. */
export async function getCollectionTiles(): Promise<CollectionTile[]> {
	"use cache";
	cacheLife("minutes");
	const [collections, products] = await Promise.all([
		commerce.collectionBrowse({ limit: 20 }).catch(() => ({ data: [] })),
		getCatalogProducts(),
	]);
	return collections.data.filter(isListedCollection).flatMap((collection) => {
		const productIds = collection.productCollections.map((pc) => pc.productId);
		const member = products.find((p) => productIds.includes(p.id));
		const image = collection.image ?? firstStill(member?.images);
		return image
			? [
					{
						id: collection.id,
						name: collection.name,
						href: `/collection/${collection.slug}`,
						image,
						description: richTextToPlain(collection.description),
						productIds,
					},
				]
			: [];
	});
}
