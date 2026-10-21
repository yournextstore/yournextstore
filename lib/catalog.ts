import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { plainText } from "@/lib/display";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";

const shortMoney = (formatted: string) => formatted.replace(/\.00(?=\D*$)/, "");

/** The store's own facts for the top bar, header and footer: nothing invented. */
export async function getStoreInfo() {
	"use cache";
	cacheLife("hours");
	const [me, { currency, locale }, socials] = await Promise.all([
		meGetCached().catch(() => null),
		getStoreConfig(),
		commerce.socialsGet().catch(() => null),
	]);
	const settings = me?.store.settings;
	const threshold = Number(settings?.freeShippingThreshold ?? 0);
	const tools = settings?.enabledTools;
	const socialLinks = Object.entries(socials?.socials ?? {})
		.filter((entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].startsWith("http"))
		.map(([network, href]) => ({
			label: network === "x" ? "X" : network.charAt(0).toUpperCase() + network.slice(1),
			href,
		}));
	return {
		storeName: me?.store.name || "Your Next Store",
		storeDescription: settings?.storeDescription || null,
		freeShipping: threshold ? shortMoney(formatMoney({ amount: BigInt(threshold), currency, locale })) : null,
		freeShippingAmount: threshold || null,
		blog: tools?.blog ?? false,
		contact: tools?.contactForm ?? false,
		newsletter: tools?.newsletter ?? false,
		socialLinks,
	};
}

export async function getProducts(limit: number) {
	"use cache";
	cacheLife("minutes");
	const result = await commerce
		.productBrowse({ active: true, limit })
		.catch(() => ({ data: [], meta: { count: 0 } }));
	return result.data;
}

export type Product = Awaited<ReturnType<typeof getProducts>>[number];

export type CollectionEntry = {
	slug: string;
	name: string;
	description: string;
	image: string | null;
	products: Product[];
};

/**
 * Collections with their members, resolved from one browse: `collectionBrowse` returns only the
 * member ids. A collection without its own image is pictured by its first product.
 */
export async function getCollections(): Promise<CollectionEntry[]> {
	"use cache";
	cacheLife("minutes");
	const [collections, products] = await Promise.all([
		commerce.collectionBrowse({ limit: 12 }).catch(() => ({ data: [] })),
		getProducts(100),
	]);
	const entries = collections.data.map((collection) => {
		const ids = new Set(
			("productCollections" in collection && Array.isArray(collection.productCollections)
				? collection.productCollections
				: []
			).map((pc: { productId: string }) => pc.productId),
		);
		const members = products.filter((p) => ids.has(p.id));
		return {
			slug: collection.slug,
			name: collection.name,
			description: plainText(collection.description),
			image: collection.image ?? members[0]?.images[0] ?? null,
			products: members,
			ruled: (collection.metafieldRules?.length ?? 0) > 0,
		};
	});
	// A manual collection with no members would open on an empty page: keep it out of every menu and section.
	return entries
		.filter((entry) => entry.products.length > 0 || entry.ruled)
		.map(({ ruled: _ruled, ...entry }) => entry);
}

export type CategoryEntry = { slug: string; name: string; count: number };

/** Top-level categories that hold products, with how many each lists. */
export async function getCategories(): Promise<CategoryEntry[]> {
	"use cache";
	cacheLife("minutes");
	const [categories, products] = await Promise.all([
		commerce.categoriesBrowse({ limit: 50 }).catch(() => ({ data: [] })),
		getProducts(100),
	]);
	return categories.data
		.filter((category) => !category.parentId)
		.map((category) => ({
			slug: category.slug,
			name: category.name.split(">").at(-1)?.trim() || category.name,
			count: products.filter((p) => p.category?.id === category.id).length,
		}))
		.filter((category) => category.count > 0);
}

/** Pictured products first (stable), so a bare card never leads a rail or tile row. */
export function picturedFirst<T extends { images: string[] }>(items: readonly T[]): T[] {
	return [
		...items.filter((item) => item.images.length > 0),
		...items.filter((item) => item.images.length === 0),
	];
}

/** Bundled editorial photographs (see NOTICE.md): gym, track and city training in navy blues. */
export const PHOTOS = {
	hero: [
		"/images/pexels/hero-blue-house.jpg",
		"/images/pexels/hero-escalator.jpg",
		"/images/pexels/hero-striped-wall.jpg",
	],
	wide: ["/images/pexels/wide-city-hoodie.jpg", "/images/pexels/wide-bridge-walk.jpg"],
	cards: [
		"/images/pexels/card-open-road.jpg",
		"/images/pexels/card-lane-five.jpg",
		"/images/pexels/card-boardwalk.jpg",
		"/images/pexels/card-painted-blocks.jpg",
	],
	listing: "/images/pexels/banner-mural-run.jpg",
	collection: "/images/pexels/banner-track-laces.jpg",
} as const;

/** The home promo band ("PREMIUM ISOLATE"): the store's highest-priced product. */
export async function getFeaturedProduct() {
	"use cache";
	cacheLife("minutes");
	const [products, { currency, locale, taxBehavior }] = await Promise.all([
		getProducts(100),
		getStoreConfig(),
	]);
	const priced = products
		.filter((p) => p.variants.length > 0 && p.images.length > 0)
		.map((p) => ({ product: p, min: priceRange(p.variants, taxBehavior).min }))
		.sort((a, b) => (a.min === b.min ? 0 : a.min > b.min ? -1 : 1));
	const top = priced[0];
	if (!top) return null;
	return {
		product: top.product,
		price: formatMoney({ amount: top.min, currency, locale }),
	};
}
