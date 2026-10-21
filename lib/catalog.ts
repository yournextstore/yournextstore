import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { isVideoUrl } from "@/lib/utils";

// One browse backs the home page, the header menu and the about page, so every section
// can share products without repeating any and the chrome stays in the prerendered shell.
async function getCatalogProducts() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({ active: true, limit: 100 }).catch(() => ({ data: [] }));
	return data;
}

export type CatalogProduct = Awaited<ReturnType<typeof getCatalogProducts>>[number];

export function productStill(product: { images: readonly string[] }) {
	return product.images.find((image) => !isVideoUrl(image)) ?? null;
}

export type CatalogCategory = {
	name: string;
	slug: string;
	description: string | null;
	count: number;
	image: string | null;
};

/** Top-level categories that hold products, largest first, each pictured by one of its products. */
export async function getCatalogCategories(): Promise<CatalogCategory[]> {
	"use cache";
	cacheLife("minutes");
	const products = await getCatalogProducts();
	const bySlug = new Map<string, CatalogCategory>();
	for (const product of products) {
		const category = product.category;
		if (!category || category.parentId) continue;
		const entry = bySlug.get(category.slug) ?? {
			name: category.name,
			slug: category.slug,
			description: typeof category.description === "string" ? category.description : null,
			count: 0,
			image: typeof category.image === "string" ? category.image : null,
		};
		// The best-photographed product pictures a category that has no image of its own.
		const still = productStill(product);
		bySlug.set(category.slug, {
			...entry,
			count: entry.count + 1,
			image: entry.image ?? still,
		});
	}
	return [...bySlug.values()].sort((a, b) => b.count - a.count);
}

/**
 * The home page's product rows. New arrivals are the newest; "top picks" are the
 * best-photographed of the rest (a gallery of several shots). No product appears in both rows.
 */
export async function getHomeProducts() {
	"use cache";
	cacheLife("minutes");
	const products = await getCatalogProducts();
	const pictured = products.filter((product) => productStill(product));
	const arrivals = [...pictured]
		.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
		.slice(0, 4);
	const taken = new Set(arrivals.map((product) => product.id));
	const picks = [...pictured]
		.filter((product) => !taken.has(product.id))
		.sort((a, b) => b.images.length - a.images.length)
		.slice(0, 4);
	return { arrivals, picks };
}

/** Real numbers for the hero's stat row. */
export async function getCatalogStats() {
	"use cache";
	cacheLife("minutes");
	const [products, categories] = await Promise.all([getCatalogProducts(), getCatalogCategories()]);
	return {
		products: products.length,
		categories: categories.length,
		options: products.reduce((sum, product) => sum + Math.max(1, product.variants.length), 0),
	};
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
		reviewsEnabled: settings?.enabledTools?.reviews ?? false,
	};
}

/**
 * Splits a plain-text product summary into prose and "LABEL: value" lines. Merchants (and
 * imports from other shops) often write care, size and material notes that way; the product
 * page shows them as the original's specification table.
 */
export function parseSummary(summary: string | null | undefined, productName: string) {
	const paragraphs = (summary ?? "")
		.split(/\n\s*\n|\r\n\s*\r\n/)
		.map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
		.filter((paragraph) => paragraph && paragraph.toLowerCase() !== productName.trim().toLowerCase());
	const specs: { label: string; value: string }[] = [];
	const prose: string[] = [];
	for (const paragraph of paragraphs) {
		const match = /^([\p{Lu}][\p{L} /&-]{1,28}):\s*(.+)$/u.exec(paragraph);
		if (match?.[1] && match[2] && match[1] === match[1].toUpperCase()) {
			const label = match[1].trim().toLowerCase();
			specs.push({ label: label.charAt(0).toUpperCase() + label.slice(1), value: match[2].trim() });
		} else {
			prose.push(paragraph);
		}
	}
	// No free prose: the longest labelled entry is the description ("DESCRIPTION: …").
	const longest = [...specs].sort((a, b) => b.value.length - a.value.length)[0];
	const leadSpec = prose.length === 0 && longest && longest.value.length > 80 ? longest : null;
	return {
		lead: prose[0] ?? leadSpec?.value ?? null,
		prose: prose.slice(1),
		specs: specs.filter((spec) => spec !== leadSpec),
	};
}
