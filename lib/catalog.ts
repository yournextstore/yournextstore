import { cacheLife } from "next/cache";
import { try_ } from "safe-try";
import { commerce, meGetCached } from "@/lib/commerce";
import { sentenceCase } from "@/lib/display";

export type CategorySummary = {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	productCount: number;
};

/** Top-level categories with their product counts: the original's category tiles and nav menus. */
export async function getCategorySummaries(): Promise<CategorySummary[]> {
	"use cache";
	cacheLife("hours");
	const [error, result] = await try_(commerce.categoriesBrowse({ limit: 50 }));
	if (error) {
		return [];
	}
	const categories = result.data.filter((category) => category.active && !category.parentId);
	const counts = await Promise.all(
		categories.map(async (category) => {
			const [countError, browse] = await try_(
				commerce.productBrowse({ active: true, category: category.slug, limit: 1 }),
			);
			return countError ? 0 : browse.meta.count;
		}),
	);
	return categories
		.map((category, index) => ({
			id: category.id,
			name: sentenceCase(category.name),
			slug: category.slug,
			description: typeof category.description === "string" ? category.description : null,
			productCount: counts[index] ?? 0,
		}))
		.filter((category) => category.productCount > 0);
}

export async function getStoreName() {
	"use cache";
	cacheLife("hours");
	const [error, me] = await try_(meGetCached());
	if (error) {
		return "Store";
	}
	const settingsName = me.store.settings?.storeName;
	return (typeof settingsName === "string" && settingsName) || me.store.name || "Store";
}

export async function getStoreDescription() {
	"use cache";
	cacheLife("hours");
	const [error, me] = await try_(meGetCached());
	if (error) {
		return null;
	}
	const description = me.store.settings?.storeDescription;
	return typeof description === "string" && description.trim() ? description.trim() : null;
}

export async function getProductTotal() {
	"use cache";
	cacheLife("hours");
	const [error, result] = await try_(commerce.productBrowse({ active: true, limit: 1 }));
	return error ? 0 : result.meta.count;
}

const SOCIAL_LABELS = {
	instagram: "Instagram",
	facebook: "Facebook",
	x: "X",
	tiktok: "TikTok",
	youtube: "YouTube",
	linkedin: "LinkedIn",
} as const;

export async function getSocialLinks() {
	"use cache";
	cacheLife("hours");
	const [error, result] = await try_(commerce.socialsGet());
	if (error) {
		return [];
	}
	const socials: Partial<Record<string, string | null>> = result.socials ?? {};
	return Object.entries(SOCIAL_LABELS).flatMap(([key, label]): { label: string; href: string }[] => {
		const href = socials[key];
		return href ? [{ label, href }] : [];
	});
}

/** Products with a photo first (product or variant images), keeping the store's order otherwise. */
export function picturedFirst<
	T extends { images?: string[] | null; variants?: { images?: string[] | null }[] },
>(products: T[]): T[] {
	const hasImage = (product: T) =>
		(product.images?.length ?? 0) > 0 || (product.variants ?? []).some((v) => (v.images?.length ?? 0) > 0);
	return [...products.filter(hasImage), ...products.filter((product) => !hasImage(product))];
}
