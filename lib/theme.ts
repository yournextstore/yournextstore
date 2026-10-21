import { cacheLife } from "next/cache";
import { try_ } from "safe-try";
import { commerce, meGetCached } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { getStoreConfig } from "@/lib/store-config";
import { isVideoUrl } from "@/lib/utils";

/** Store identity for the chrome: display name, tagline, free-shipping line and optional tools. */
export async function getStoreIdentity() {
	"use cache";
	cacheLife("hours");

	const [error, me] = await try_(meGetCached());
	if (error) {
		return {
			name: "Your Next Store",
			description: null,
			freeShipping: null,
			blogEnabled: false,
			contactEnabled: false,
			newsletterEnabled: false,
		};
	}
	const settings = me.store.settings;
	const threshold = settings?.freeShippingThreshold ? BigInt(settings.freeShippingThreshold) : null;
	const { currency, locale } = await getStoreConfig();

	return {
		name: settings?.storeName || me.store.name || "Your Next Store",
		description: settings?.storeDescription || null,
		freeShipping: threshold && threshold > 0n ? formatMoney({ amount: threshold, currency, locale }) : null,
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

export type Shot = { src: string; slug: string; name: string };

/** The first still of each product, newest first: the photo strip's tiles. */
export async function getProductShots() {
	"use cache";
	cacheLife("minutes");

	const products = await commerce
		.productBrowse({ active: true, limit: 24, orderBy: "createdAt", orderDirection: "desc" })
		.catch(() => ({ data: [] }));
	return products.data.flatMap((p): Shot[] => {
		const first = [...p.images, ...p.variants.flatMap((v) => v.images ?? [])].find((url) => !isVideoUrl(url));
		return first ? [{ src: first, slug: p.slug, name: p.name }] : [];
	});
}

/**
 * Active categories ordered by how many products they hold, each with a photo of one
 * of its products: the stand-in for the original's "Women / Men / Accessories" collections.
 */
export async function getFeaturedCategories() {
	"use cache";
	cacheLife("minutes");

	// The filter facets list the active categories that hold products (no category browse in the SDK).
	const facets = await commerce.productFilters().catch(() => ({ categories: [] }));
	const top = facets.categories;
	const withProducts = await Promise.all(
		top.map(async (category) => {
			const result = await commerce
				.productBrowse({ active: true, category: category.slug, limit: 4 })
				.catch(() => ({ data: [], meta: { count: 0 } }));
			const images = result.data.flatMap((p) =>
				[...p.images, ...p.variants.flatMap((v) => v.images ?? [])].filter((url) => !isVideoUrl(url)),
			);
			return {
				name: displayName(category.name),
				slug: category.slug,
				count: result.meta.count,
				image: images[0] ?? null,
			};
		}),
	);
	return withProducts.filter((c) => c.count > 0).sort((a, b) => b.count - a.count);
}

export async function getInstagramUrl() {
	"use cache";
	cacheLife("hours");
	const socials = await commerce.socialsGet().catch(() => null);
	return socials?.socials?.instagram ?? null;
}

/**
 * Collections that hold products, then the featured categories: the stand-in for the
 * original's "Women / Men" pairs (hero buttons, split panels).
 */
export async function getFeaturedGroups() {
	"use cache";
	cacheLife("minutes");

	const facets = await commerce.productFilters().catch(() => ({ collections: [] }));
	const collections = await Promise.all(
		facets.collections.map(async (collection) => {
			const result = await commerce
				.productBrowse({ active: true, collection: collection.slug, limit: 1 })
				.catch(() => ({ meta: { count: 0 } }));
			return {
				href: `/collection/${collection.slug}`,
				title: displayName(collection.name),
				count: result.meta.count,
			};
		}),
	);
	const categories = await getFeaturedCategories();
	return [
		...collections.filter((c) => c.count > 0).sort((a, b) => b.count - a.count),
		...categories.map((c) => ({ href: `/category/${c.slug}`, title: c.name, count: c.count })),
	];
}
