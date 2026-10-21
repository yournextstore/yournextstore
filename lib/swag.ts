import { cacheLife } from "next/cache";
import { try_ } from "safe-try";
import { commerce, meGetCached } from "@/lib/commerce";

/** Store identity for the chrome: display name plus the optional tools the footer links to. */
export async function getStoreIdentity() {
	"use cache";
	cacheLife("hours");

	const [error, me] = await try_(meGetCached());
	if (error) {
		return {
			name: "Your Next Store",
			description: null,
			blogEnabled: false,
			contactEnabled: false,
			newsletterEnabled: false,
		};
	}
	const settings = me.store.settings;
	return {
		name: settings?.storeName || me.store.name || "Your Next Store",
		description: settings?.storeDescription || null,
		blogEnabled: settings?.enabledTools?.blog ?? false,
		contactEnabled: settings?.enabledTools?.contactForm ?? false,
		newsletterEnabled: settings?.enabledTools?.newsletter ?? false,
	};
}

/** Category names are stored as typed in the admin (often lower case); capitalise for display. */
export function displayName(name: string) {
	const last = name.split(">").at(-1)?.trim() ?? name;
	return last.charAt(0).toUpperCase() + last.slice(1);
}

export type CategoryCount = { name: string; slug: string; count: number };

/**
 * Active categories that hold products, largest first, with their product counts: the
 * original's "Hats (4) Clothing (11)" filter line.
 */
export async function getCategoryCounts(): Promise<{ total: number; categories: CategoryCount[] }> {
	"use cache";
	cacheLife("minutes");

	const [facets, all] = await Promise.all([
		commerce.productFilters().catch(() => ({ categories: [] })),
		commerce.productBrowse({ active: true, limit: 1 }).catch(() => ({ meta: { count: 0 } })),
	]);
	const counted = await Promise.all(
		facets.categories.map(async (category) => {
			const result = await commerce
				.productBrowse({ active: true, category: category.slug, limit: 1 })
				.catch(() => ({ meta: { count: 0 } }));
			return { name: displayName(category.name), slug: category.slug, count: result.meta.count };
		}),
	);
	return {
		total: all.meta.count,
		categories: counted.filter((c) => c.count > 0).sort((a, b) => b.count - a.count),
	};
}

export type CartBucket = {
	label: string;
	href: string;
	/** Product ids filed under this bucket; `null` marks the catch-all bucket. */
	productIds: string[] | null;
};

/**
 * The cart panel sorts lines into four labelled buckets (the original's hats / clothing /
 * accessories / goods). Here: the three largest categories, then a catch-all for the rest.
 * A store without categories gets the catch-all alone.
 */
export async function getCartBuckets(): Promise<CartBucket[]> {
	"use cache";
	cacheLife("minutes");

	const { categories } = await getCategoryCounts();
	const top = categories.slice(0, 3);
	const named = await Promise.all(
		top.map(async (category) => {
			const result = await commerce
				.productBrowse({ active: true, category: category.slug, limit: 100 })
				.catch(() => ({ data: [] }));
			return {
				label: category.name,
				href: `/category/${category.slug}`,
				productIds: result.data.map((p) => p.id),
			};
		}),
	);
	return [
		...named,
		{ label: named.length > 0 ? "Everything else" : "Your picks", href: "/products", productIds: null },
	];
}

/** The colour blocks the home grid cycles through (the original sets one per product in its CMS). */
export const TILE_COLORS = [
	"bg-swag-yellow",
	"bg-swag-graphite",
	"bg-swag-orange",
	"bg-swag-blue",
	"bg-swag-graphite",
	"bg-swag-orange",
	"bg-swag-green",
	"bg-swag-blue",
	"bg-swag-yellow",
	"bg-black",
	"bg-swag-blue",
	"bg-swag-green",
	"bg-swag-yellow",
	"bg-swag-orange",
] as const;
