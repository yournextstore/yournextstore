import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";
import { editorialPhoto } from "@/lib/editorial";
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

export const firstStill = (images: readonly string[] | null | undefined) =>
	images?.find((image) => !isVideoUrl(image)) ?? null;

/** Photographed, priced products first; the rest keep their order at the end. */
export function photographedFirst<
	P extends { images?: readonly string[] | null; variants: readonly { price: string }[] },
>(products: readonly P[]): P[] {
	const leads = (p: P) => Boolean(firstStill(p.images)) && p.variants.some((v) => Number(v.price) > 0);
	return [...products.filter(leads), ...products.filter((p) => !leads(p))];
}

/** One browse of the catalog backs the home carousels, the brand lookups and image fallbacks. */
export async function getCatalogProducts() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce
		.productBrowse({ active: true, limit: 100, orderBy: "createdAt", orderDirection: "desc" })
		.catch(() => ({ data: [] }));
	return photographedFirst(data);
}

/** Brand id → name/slug. The browse payload carries `brandId` only; cards show the brand like the original. */
export async function getBrandMap() {
	"use cache";
	cacheLife("hours");
	const { data } = await commerce.brandBrowse({ limit: 100 }).catch(() => ({ data: [] }));
	return Object.fromEntries(
		data.filter((brand) => brand.active).map((brand) => [brand.id, { name: brand.name, slug: brand.slug }]),
	) as Record<string, { name: string; slug: string }>;
}

export type Tile = {
	id: string;
	name: string;
	href: string;
	image: string | null;
	/** Bundled editorial photo for banner-sized slots. */
	photo: string;
	description: string;
};

/** Top-level categories that have products, pictured by their own image or their first product's. */
export async function getCategoryTiles(): Promise<Tile[]> {
	"use cache";
	cacheLife("minutes");
	const [categories, products] = await Promise.all([
		commerce.categoriesBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] })),
		getCatalogProducts(),
	]);
	return categories.data
		.filter((category) => !category.parentId)
		.flatMap((category, index) => {
			const product = products.find((p) => p.categoryId === category.id);
			if (!product) return [];
			return [
				{
					id: category.id,
					name: category.name,
					href: `/category/${category.slug}`,
					image: category.image ?? firstStill(product.images),
					photo: editorialPhoto(index + 1),
					description: richTextToPlain(category.description),
				},
			];
		});
}

export type CollectionTile = Tile & { slug: string; productIds: string[] };

/** Active collections with members, each pictured by its first member and given an editorial photo. */
export async function getCollectionTiles(): Promise<CollectionTile[]> {
	"use cache";
	cacheLife("minutes");
	const [collections, products] = await Promise.all([
		commerce.collectionBrowse({ limit: 50 }).catch(() => ({ data: [] })),
		getCatalogProducts(),
	]);
	return collections.data
		.filter((collection) => collection.active)
		.flatMap((collection) => {
			const memberIds = new Set(collection.productCollections.map((pc) => pc.productId));
			const members = products.filter((p) => memberIds.has(p.id));
			if (members.length === 0) return [];
			return {
				id: collection.id,
				slug: collection.slug,
				name: collection.name,
				href: `/collection/${collection.slug}`,
				image: firstStill(members[0]?.images) ?? null,
				photo: "",
				description: richTextToPlain(collection.description),
				productIds: members.map((p) => p.id),
			};
		})
		.map((tile, index) => ({ ...tile, photo: editorialPhoto(index) }));
}

/** Words for "how many options": "2 sizes" when the only option is a size, else "3 options". */
export function optionCountLabel(
	variants: readonly { combinations?: readonly { variantValue: { variantType: { label: string } } }[] }[],
) {
	if (variants.length < 2) return null;
	const labels = new Set(
		variants.flatMap((v) =>
			(v.combinations ?? []).map((c) => c.variantValue.variantType.label.toLowerCase()),
		),
	);
	const only = labels.size === 1 ? [...labels][0] : null;
	if (only === "size") return `${variants.length} sizes`;
	if (only === "colour" || only === "color") return `${variants.length} colours`;
	return `${variants.length} options`;
}
