import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { sentenceCase } from "@/lib/display";
import { isVideoUrl } from "@/lib/utils";

// One browse backs the home page sections and the header menu, so the chrome stays in the shell.
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

export async function getStoreIdentity() {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	const settings = me?.store.settings;
	return {
		storeName: settings?.storeName || me?.store.name || "Your Next Store",
		storeDescription: settings?.storeDescription || null,
		blogEnabled: settings?.enabledTools?.blog ?? false,
		contactFormEnabled: settings?.enabledTools?.contactForm ?? false,
	};
}

export type CatalogCategory = { name: string; slug: string; count: number };

/** Top-level categories that hold products, largest first. */
export async function getCatalogCategories(): Promise<CatalogCategory[]> {
	"use cache";
	cacheLife("minutes");
	const products = await getCatalogProducts();
	const bySlug = new Map<string, CatalogCategory>();
	for (const product of products) {
		const category = product.category;
		if (!category || category.parentId) continue;
		const entry = bySlug.get(category.slug) ?? {
			name: sentenceCase(category.name),
			slug: category.slug,
			count: 0,
		};
		bySlug.set(category.slug, { ...entry, count: entry.count + 1 });
	}
	return [...bySlug.values()].sort((a, b) => b.count - a.count);
}

/** "Our bestsellers!": in-stock, pictured pieces, the best-photographed first. */
export async function getBestsellers(limit: number) {
	"use cache";
	cacheLife("minutes");
	const products = await getCatalogProducts();
	const available = (product: CatalogProduct) => product.variants.some((variant) => variant.stock !== 0);
	return products
		.filter((product) => stills(product.images).length > 0)
		.sort((a, b) => Number(available(b)) - Number(available(a)) || b.images.length - a.images.length)
		.slice(0, limit);
}
