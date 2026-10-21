import { cacheLife } from "next/cache";
import { try_ } from "safe-try";
import { commerce, meGetCached } from "@/lib/commerce";
import { richTextToPlain } from "@/lib/display";
import { isVideoUrl } from "@/lib/utils";

export type Tile = { href: string; label: string; description: string; image: string | null };

export async function getStoreIdentity() {
	"use cache";
	cacheLife("hours");
	const [error, me] = await try_(meGetCached());
	if (error) return { name: "Store", description: null as string | null };
	return {
		name: me.store.settings?.storeName || me.store.name || "Store",
		description: me.store.settings?.storeDescription || null,
	};
}

const firstImage = (images: string[] | null | undefined) =>
	(images ?? []).find((url) => !isVideoUrl(url)) ?? null;

/** Top-level categories, each pictured by its own image or its first product's. */
export async function getCategoryTiles(): Promise<Tile[]> {
	"use cache";
	cacheLife("minutes");
	const [error, result] = await try_(commerce.categoriesBrowse({ limit: 12 }));
	if (error) return [];
	const top = result.data.filter((category) => !category.parentId);
	return Promise.all(
		top.map(async (category) => {
			const products = category.image
				? null
				: await commerce.productBrowse({ active: true, category: category.slug, limit: 1 }).catch(() => null);
			return {
				href: `/category/${category.slug}`,
				label: category.name,
				description: richTextToPlain(category.description),
				image: category.image ?? firstImage(products?.data[0]?.images),
			};
		}),
	);
}

export async function getCollectionTiles(): Promise<Tile[]> {
	"use cache";
	cacheLife("minutes");
	const [error, result] = await try_(commerce.collectionBrowse({ limit: 12 }));
	if (error) return [];
	// A manual collection with no members would open on an empty page: leave it out of the nav.
	const filled = result.data.filter(
		(collection) =>
			collection.productCollections.length > 0 ||
			(Array.isArray(collection.metafieldRules) && collection.metafieldRules.length > 0),
	);
	return filled.map((collection) => ({
		href: `/collection/${collection.slug}`,
		label: collection.name,
		description: richTextToPlain(collection.description),
		image: collection.image ?? null,
	}));
}

/**
 * Photographs for the editorial slots (hero, collection grid, "less is more" band, banners).
 * The original's interiors are not licensed for reuse, so these are bundled Pexels photographs
 * (credited in NOTICE.md); product cards, product pages and the cart use the store's own images.
 */
export const EDITORIAL = {
	hero: "/images/pexels/hero-field.jpg",
	feature: "/images/pexels/feature-beach.jpg",
	side: ["/images/pexels/side-sandals.jpg", "/images/pexels/side-clipboard.jpg"] as [string, string],
	less: "/images/pexels/less-tote.jpg",
	aboutBanner: "/images/pexels/about-stones.jpg",
	aboutLess: "/images/pexels/about-book.jpg",
	/** Collection and category banners when the store has no image of its own. */
	banner: "/images/pexels/banner-desk.jpg",
};

export async function getSocials() {
	"use cache";
	cacheLife("hours");
	const [error, result] = await try_(commerce.socialsGet());
	if (error) return [];
	const labels = {
		instagram: "Instagram",
		facebook: "Facebook",
		x: "X",
		tiktok: "TikTok",
		youtube: "YouTube",
		linkedin: "LinkedIn",
	} as const;
	return (Object.keys(labels) as (keyof typeof labels)[]).flatMap((key) => {
		const href = result.socials[key];
		return href ? [{ label: labels[key] as string, href }] : [];
	});
}

export async function getContactEmail() {
	"use cache";
	cacheLife("hours");
	const [error, result] = await try_(commerce.socialsGet());
	return error ? null : result.socials.email;
}
