import type { APIProductsBrowseResult } from "commerce-kit";
import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { getStoreConfig } from "@/lib/store-config";
import { isVideoUrl } from "@/lib/utils";

export type BrowseProduct = APIProductsBrowseResult["data"][number];

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

export const firstStill = (images: readonly string[] | null | undefined) =>
	images?.find((image) => !isVideoUrl(image)) ?? null;

/** Store name, description, the tools that add footer links, and the free-delivery threshold. */
export async function getStoreBrand() {
	"use cache";
	cacheLife("hours");
	const [me, config] = await Promise.all([meGetCached().catch(() => null), getStoreConfig()]);
	const name = me?.store.settings?.storeName || me?.store.name || "Your Next Store";
	const threshold = Number(me?.store.settings?.freeShippingThreshold ?? 0);
	return {
		name,
		description: me?.store.settings?.storeDescription || "",
		blog: me?.store.settings?.enabledTools?.blog ?? false,
		contact: me?.store.settings?.enabledTools?.contactForm ?? false,
		freeShippingThreshold: threshold > 0 ? threshold : null,
		// Whole amounts drop their ".00" so the hero line reads "orders over $100" like the original.
		freeShippingLabel:
			threshold > 0
				? formatMoney({ amount: threshold, currency: config.currency, locale: config.locale }).replace(
						/[.,]00(?!\d)/,
						"",
					)
				: null,
	};
}

/** One cached browse of the catalog backs every section that needs products or a fallback image. */
export async function getCatalogProducts() {
	"use cache";
	cacheLife("minutes");
	const { data, meta } = await commerce
		.productBrowse({ active: true, limit: 100, orderBy: "createdAt", orderDirection: "desc" })
		.catch(() => ({ data: [] as BrowseProduct[], meta: { count: 0 } }));
	return { products: data, total: meta.count };
}

export type ShowcaseTile = {
	id: string;
	name: string;
	slug: string;
	href: string;
	image: string | null;
	ownImage: boolean;
	description: string;
	count: number;
	parentId: string | null;
};

/**
 * Active categories that hold products (a parent counts its sub-categories' products too),
 * pictured by their own image or their first product's packshot.
 */
export async function getCategoryTiles(): Promise<ShowcaseTile[]> {
	"use cache";
	cacheLife("minutes");
	const [categories, { products }] = await Promise.all([
		commerce.categoriesBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] })),
		getCatalogProducts(),
	]);
	// Parents first (in the merchant's order), then sub-categories; each tile pictured by a product
	// photo no earlier tile uses, so a parent and its only child do not show the same packshot.
	const ordered = [
		...categories.data.filter((c) => !c.parentId),
		...categories.data.filter((c) => c.parentId),
	];
	const used = new Set<string>();
	return ordered
		.map((category) => {
			const childIds = new Set(
				categories.data.filter((child) => child.parentId === category.id).map((child) => child.id),
			);
			const members = products.filter(
				(p) => p.category?.id === category.id || (p.category?.id && childIds.has(p.category.id)),
			);
			const stills = members.map((p) => firstStill(p.images)).filter((img): img is string => Boolean(img));
			const fresh = category.image ? null : (stills.find((img) => !used.has(img)) ?? stills[0] ?? null);
			if (fresh) used.add(fresh);
			return {
				id: category.id,
				name: category.name,
				slug: category.slug,
				href: `/category/${category.slug}`,
				image: category.image ?? fresh,
				ownImage: Boolean(category.image),
				description: richTextToPlain(category.description),
				count: members.length,
				parentId: category.parentId ?? null,
			};
		})
		.filter((tile) => tile.count > 0);
}

/** Active collections with products, pictured by their own image or their first product's. */
export async function getCollectionTiles(): Promise<ShowcaseTile[]> {
	"use cache";
	cacheLife("minutes");
	const [collections, { products }] = await Promise.all([
		commerce.collectionBrowse({ limit: 50 }).catch(() => ({ data: [] })),
		getCatalogProducts(),
	]);
	return collections.data
		.filter((collection) => collection.active)
		.map((collection) => {
			const memberIds = new Set(collection.productCollections.map((pc) => pc.productId));
			const members = products.filter((p) => memberIds.has(p.id));
			const withImage = members.find((p) => firstStill(p.images));
			return {
				id: collection.id,
				name: collection.name,
				slug: collection.slug,
				href: `/collection/${collection.slug}`,
				image: collection.image ?? firstStill(withImage?.images),
				ownImage: Boolean(collection.image),
				description: richTextToPlain(collection.description),
				count: members.length,
				parentId: null,
			};
		})
		.filter((tile) => tile.count > 0);
}

/** Collection members in the order the merchant set, for the "Daily Best Sells" row. */
export async function getCollectionMembers(collectionId: string) {
	"use cache";
	cacheLife("minutes");
	const [collections, { products }] = await Promise.all([
		commerce.collectionBrowse({ limit: 50 }).catch(() => ({ data: [] })),
		getCatalogProducts(),
	]);
	const collection = collections.data.find((c) => c.id === collectionId);
	if (!collection) return [];
	const byId = new Map(products.map((p) => [p.id, p]));
	return collection.productCollections.flatMap((pc) => {
		const product = byId.get(pc.productId);
		return product ? [product] : [];
	});
}

const SOCIAL_LABELS = {
	facebook: "Facebook",
	x: "X",
	instagram: "Instagram",
	youtube: "YouTube",
	tiktok: "TikTok",
	linkedin: "LinkedIn",
} as const;

export type SocialLink = { key: keyof typeof SOCIAL_LABELS; label: string; href: string };

/** The store's configured social profiles, in the original footer's order. */
export async function getSocialLinks(): Promise<SocialLink[]> {
	"use cache";
	cacheLife("hours");
	const socials = await commerce.socialsGet().catch(() => null);
	if (!socials) return [];
	return (Object.keys(SOCIAL_LABELS) as (keyof typeof SOCIAL_LABELS)[]).flatMap((key) => {
		const href = socials.socials[key];
		return href ? [{ key, label: SOCIAL_LABELS[key], href }] : [];
	});
}

/** Legal pages for the footer (empty for an unpublished store, see the playbook). */
export async function getLegalLinks() {
	"use cache";
	cacheLife("hours");
	const pages = await commerce.legalPageBrowse().catch(() => ({ data: [] }));
	return pages.data.map((page) => ({ href: `/legal${page.href}`, label: page.label }));
}

// `new Date()` is an unstable value; caching pins it to the entry.
export async function getCopyrightYear() {
	"use cache";
	cacheLife("days");
	return new Date().getFullYear();
}

/** Products with a photograph (their own or a variant's) first, in their original order. */
export function picturedFirst<T extends { images?: readonly string[] | null; variants?: unknown }>(
	items: readonly T[],
): T[] {
	const pictured = (item: T) =>
		Boolean(firstStill(item.images)) ||
		(Array.isArray(item.variants) &&
			item.variants.some(
				(variant: unknown) =>
					typeof variant === "object" &&
					variant !== null &&
					"images" in variant &&
					Array.isArray(variant.images) &&
					variant.images.length > 0,
			));
	return [...items.filter(pictured), ...items.filter((item) => !pictured(item))];
}
