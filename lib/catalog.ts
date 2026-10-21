import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { isVideoUrl } from "@/lib/utils";

// One browse backs the home page, the header's Shop menu and the about page, so every
// section can share products without repeating any and the chrome stays in the shell.
async function getCatalogProducts() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({ active: true, limit: 100 }).catch(() => ({ data: [] }));
	return data;
}

export type CatalogProduct = Awaited<ReturnType<typeof getCatalogProducts>>[number];

function stills(images: readonly string[]) {
	return images.filter((image) => !isVideoUrl(image));
}

/** Product photos, then variant photos (some products only carry images on their variants). */
function productImages(product: CatalogProduct) {
	return [...product.images, ...product.variants.flatMap((variant) => variant.images ?? [])];
}

export type CatalogCategory = {
	name: string;
	slug: string;
	count: number;
	image: string | null;
};

/** Top-level categories that hold products, largest first, each pictured by one of its products. */
export async function getCatalogCategories(): Promise<CatalogCategory[]> {
	"use cache";
	cacheLife("minutes");
	const products = await getCatalogProducts();
	const bySlug = new Map<string, CatalogCategory>();
	const usedImages = new Set<string>();
	for (const product of products) {
		const category = product.category;
		if (!category || category.parentId) continue;
		const entry = bySlug.get(category.slug) ?? {
			name: category.name,
			slug: category.slug,
			count: 0,
			image: typeof category.image === "string" ? category.image : null,
		};
		// A category without its own image takes the first photo of one of its products, never one
		// another tile already uses.
		const productStills = stills(productImages(product));
		const candidate = entry.image ? null : (productStills[0] ?? null);
		const image = entry.image ?? (candidate && !usedImages.has(candidate) ? candidate : null);
		if (image) usedImages.add(image);
		bySlug.set(category.slug, { ...entry, count: entry.count + 1, image });
	}
	return [...bySlug.values()].sort((a, b) => b.count - a.count);
}

/**
 * Collections that hold products, then the categories: the destinations for the editorial
 * tiles (Blueprint's tiles slider links campaigns; here the store's own groupings).
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
			return { href: `/collection/${collection.slug}`, title: collection.name, count: result.meta.count };
		}),
	);
	const categories = await getCatalogCategories();
	return [
		...collections.filter((c) => c.count > 0).sort((a, b) => b.count - a.count),
		...categories.map((c) => ({ href: `/category/${c.slug}`, title: c.name, count: c.count })),
	];
}

/**
 * Home-page product rows: the newest pictured products for the first slider, the
 * best-photographed of the rest for "Recommended". No product appears in both.
 */
export async function getHomeProducts() {
	"use cache";
	cacheLife("minutes");
	const products = await getCatalogProducts();
	// In-stock pieces lead the rows; a sold-out product only fills a gap.
	const available = (product: CatalogProduct) => product.variants.some((variant) => variant.stock !== 0);
	const pictured = products
		.filter((product) => stills(productImages(product)).length > 0)
		.sort((a, b) => Number(available(b)) - Number(available(a)));
	const arrivals = [...pictured]
		.sort(
			(a, b) =>
				Number(available(b)) - Number(available(a)) ||
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		)
		.slice(0, 8);
	const taken = new Set(arrivals.map((product) => product.id));
	const recommended = [...pictured]
		.filter((product) => !taken.has(product.id))
		.sort((a, b) => b.images.length - a.images.length)
		.slice(0, 10);
	return { arrivals, recommended };
}

export async function getStoreIdentity() {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	const settings = me?.store.settings;
	return {
		storeName: settings?.storeName || me?.store.name || "Your Next Store",
		storeDescription: settings?.storeDescription || null,
		contactFormEnabled: settings?.enabledTools?.contactForm ?? false,
		blogEnabled: settings?.enabledTools?.blog ?? false,
		newsletterEnabled: settings?.enabledTools?.newsletter ?? false,
	};
}

/** Splits a plain-text summary into paragraphs, dropping a first line that only repeats the name. */
export function summaryParagraphs(summary: string | null | undefined, productName: string) {
	const name = productName.replace(/\s+/g, " ").trim().toLowerCase();
	return (summary ?? "")
		.split(/\n\s*\n|\r\n\s*\r\n|\n/)
		.map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
		.filter((paragraph) => paragraph && paragraph.toLowerCase() !== name);
}
