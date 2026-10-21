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
	// Text runs inside one block sit side by side; blocks are separated by a space.
	const inline = node.type === "paragraph" || node.type === "heading";
	return children
		.filter(Boolean)
		.join(inline ? "" : " ")
		.trim();
}

/** Splits rich text into its paragraphs, for layouts that set each one as its own block. */
export function richTextParagraphs(value: unknown): string[] {
	if (typeof value === "string") {
		return value
			.split("\n")
			.map((p) => p.trim())
			.filter(Boolean);
	}
	if (!value || typeof value !== "object") return [];
	const node = value as { content?: unknown };
	return Array.isArray(node.content) ? node.content.map(richTextToPlain).filter(Boolean) : [];
}

// One browse of the catalog backs every "no image of its own" fallback (collection and
// category tiles borrow their first product's photograph), so it is cached once and shared.
async function getCatalogProducts() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({ active: true, limit: 100 }).catch(() => ({ data: [] }));
	return data;
}

const firstStill = (images: readonly string[] | null | undefined) =>
	images?.find((image) => !isVideoUrl(image)) ?? null;

export type ShowcaseTile = {
	id: string;
	name: string;
	href: string;
	image: string | null;
	description: string;
};

/** Top-level categories that have products, each pictured by its own image or its first product's. */
export async function getCategoryTiles(limit: number): Promise<ShowcaseTile[]> {
	"use cache";
	cacheLife("minutes");
	const [categories, products] = await Promise.all([
		commerce.categoriesBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] })),
		getCatalogProducts(),
	]);
	return categories.data
		.filter((category) => !category.parentId)
		.map((category) => {
			const product = products.find((p) => p.category?.id === category.id);
			return {
				id: category.id,
				name: category.name,
				href: `/category/${category.slug}`,
				image: category.image ?? firstStill(product?.images),
				description: richTextToPlain(category.description),
				hasProducts: Boolean(product),
			};
		})
		.filter((tile) => tile.hasProducts && tile.image)
		.slice(0, limit)
		.map(({ hasProducts: _, ...tile }) => tile);
}

/** Active collections that hold products, pictured by their own image or, failing that, one of their products'. */
export async function getCollectionTiles(limit: number): Promise<ShowcaseTile[]> {
	"use cache";
	cacheLife("minutes");
	const [collections, products] = await Promise.all([
		commerce.collectionBrowse({ limit: 50 }).catch(() => ({ data: [] })),
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
		.filter((tile) => tile.image)
		.slice(0, limit);
}

export type NavCategory = {
	id: string;
	name: string;
	href: string;
	children: { id: string; name: string; href: string }[];
};

/** Top-level categories with their direct children, for the Shop mega menu and the mobile drawer. */
export async function getNavCategories(): Promise<NavCategory[]> {
	"use cache";
	cacheLife("minutes");
	const categories = await commerce
		.categoriesBrowse({ active: true, limit: 100 })
		.catch(() => ({ data: [] }));
	const all = categories.data;
	return all
		.filter((category) => !category.parentId)
		.map((category) => ({
			id: category.id,
			name: category.name,
			href: `/category/${category.slug}`,
			children: all
				.filter((child) => child.parentId === category.id)
				.map((child) => ({
					id: child.id,
					name: child.name,
					href: `/category/${category.slug}/${child.slug}`,
				})),
		}));
}

/** Editorial photographs (generated for the store, see NOTICE.md) for the letterbox heroes, the banner and About. */
export const editorialImages = {
	hero: {
		src: "/images/pexels/hero-hanger.jpg",
		alt: "A low oat boucle sofa and a round travertine coffee table in a bright living room",
	},
	banner: {
		src: "/images/pexels/banner-knit-bag.jpg",
		alt: "The corner of a boucle sofa beside a travertine table and a grey wool throw",
	},
	aboutHero: {
		src: "/images/pexels/about-clipboard.jpg",
		alt: "Boucle, linen and velvet swatches with ash and travertine samples on a white table",
	},
	story: {
		src: "/images/pexels/story-tote-walk.jpg",
		alt: "A bright hallway opening onto a lounge chair, a steel side table and ash shelving",
	},
	craft: {
		src: "/images/pexels/craft-leather.jpg",
		alt: "Hands sanding the leg of a solid ash chair on a workshop bench",
	},
} as const;

/** Active products with a photograph and a price first, so image-led rows never open on a blank
 *  tile or on a zero-priced set. */
export async function getPicturedFirstProducts(limit: number) {
	"use cache";
	cacheLife("minutes");
	const products = await getCatalogProducts();
	const leads = (p: (typeof products)[number]) =>
		Boolean(firstStill(p.images)) && p.variants.some((variant) => Number(variant.price) > 0);
	return [...products.filter(leads), ...products.filter((p) => !leads(p))].slice(0, limit);
}

export const pick = (images: readonly string[], index: number) =>
	(images.length > 0 ? images[index % images.length] : null) ?? null;

/** The store's display name (settings first: `store.name` is often the slug). */
export async function getStoreName(): Promise<string> {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	return me?.store.settings?.storeName || me?.store.name || "Store";
}
