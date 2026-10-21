import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { fitDisplaySize, fitDisplaySizeAll } from "@/lib/display-type";
import { isVideoUrl } from "@/lib/utils";

// One browse backs the home page, the navigation and the menu, so the chrome stays in the
// prerendered shell and every section can share products without repeating any.
async function getCatalogProducts() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({ active: true, limit: 100 }).catch(() => ({ data: [] }));
	return data;
}

export type CatalogProduct = Awaited<ReturnType<typeof getCatalogProducts>>[number];

export function stills(images: readonly string[]) {
	return images.filter((image) => !isVideoUrl(image));
}

/** The photograph that leads a product everywhere: its first still. */
export function leadShot(images: readonly string[]) {
	return stills(images)[0] ?? null;
}

/** Catalogue names are sometimes lower case: sentence-case them for body type. */
export function sentenceCase(text: string) {
	const trimmed = text.trim();
	return trimmed.charAt(0).toLocaleUpperCase() + trimmed.slice(1);
}

export type ShopSection = {
	name: string;
	slug: string;
	href: string;
	count: number;
	image: string | null;
};

/** Top-level categories that hold products, largest first, each pictured by one of its products. */
export async function getShopSections(): Promise<ShopSection[]> {
	"use cache";
	cacheLife("minutes");
	const products = await getCatalogProducts();
	const bySlug = products.reduce((map, product) => {
		const category = product.category;
		if (!category || category.parentId) return map;
		const entry = map.get(category.slug);
		const image =
			typeof category.image === "string" && category.image ? category.image : leadShot(product.images);
		map.set(category.slug, {
			name: sentenceCase(category.name),
			slug: category.slug,
			href: `/category/${category.slug}`,
			count: (entry?.count ?? 0) + 1,
			image: entry?.image ?? image,
		});
		return map;
	}, new Map<string, ShopSection>());
	return [...bySlug.values()].sort((a, b) => b.count - a.count);
}

export async function getCatalogCount() {
	"use cache";
	cacheLife("minutes");
	return (await getCatalogProducts()).length;
}

/**
 * The one word that names a piece on the home hero ("Cloud Nine Hoodie" → "Hoodie"): the longest
 * word that is not filler, a size or a generic product word.
 */
const GENERIC = new Set([
	"basic",
	"fit",
	"with",
	"and",
	"the",
	"of",
	"in",
	"for",
	"le",
	"la",
	"t-shirt",
	"shirt",
	"pants",
	"piece",
	"set",
	"pro",
	"sample",
	"sale",
	"cm",
]);

export function heroWord(name: string) {
	const words = name
		.split(/[\s|/]+/)
		.map((word) => word.replace(/^[^\p{L}\d]+|[^\p{L}\d]+$/gu, ""))
		.filter((word) => word.length > 1 && !/^\d+$/.test(word));
	const candidates = words.filter((word) => !GENERIC.has(word.toLowerCase()));
	const pool = candidates.length > 0 ? candidates : words;
	const pick = pool.reduce((best, word) => (word.length > best.length ? word : best), "");
	return pick ? pick.charAt(0).toUpperCase() + pick.slice(1).toLowerCase() : name;
}

export type HeroPiece = {
	product: CatalogProduct;
	image: string;
	word: string;
	wordSize: { mobile: string; desktop: string };
	categoryLabel: string;
	/** Four pieces from other sections for the "Goes with" rail. */
	pairs: CatalogProduct[];
};

const HERO_PIECES = 4;

/**
 * The hero carousel: the best-photographed pieces, one distinct word each and at most two
 * from one section, so the deck shows the range of the store.
 */
export async function getHeroPieces(): Promise<HeroPiece[]> {
	"use cache";
	cacheLife("minutes");
	const products = await getCatalogProducts();
	// A hero piece can be bought from the hero: in stock, priced and photographed.
	const available = (product: CatalogProduct) =>
		product.variants.some((variant) => variant.stock !== 0 && Number(variant.price) > 0);
	const pictured = products.filter((product) => stills(product.images).length > 0);
	const ranked = pictured.filter(available).sort((a, b) => stills(b.images).length - stills(a.images).length);
	const picked = ranked.reduce<CatalogProduct[]>((acc, product) => {
		if (acc.length >= HERO_PIECES) return acc;
		const word = heroWord(product.name).toLowerCase();
		const section = product.category?.slug ?? "";
		const sameSection = acc.filter((other) => (other.category?.slug ?? "") === section).length;
		const sameWord = acc.some((other) => heroWord(other.name).toLowerCase() === word);
		if (!sameWord && sameSection < 2 && (product.category || ranked.length <= HERO_PIECES)) {
			acc.push(product);
		}
		return acc;
	}, []);
	const pieces = picked.length > 0 ? picked : ranked.slice(0, HERO_PIECES);

	return pieces.flatMap((product) => {
		const image = leadShot(product.images);
		if (!image) return [];
		const word = heroWord(product.name);
		// The rail may show sold-out pieces too: it links to them rather than selling from the hero.
		const pairs = pictured
			.filter((other) => other.id !== product.id && other.category?.slug !== product.category?.slug)
			.slice(0, 4);
		const fill = pictured.filter((other) => other.id !== product.id && !pairs.includes(other));
		return [
			{
				product,
				image,
				word,
				wordSize: {
					mobile: fitDisplaySize(word, { maxPx: 150, budgetPx: 343, vwBudget: 91 }),
					desktop: fitDisplaySize(word, { maxPx: 300, budgetPx: 1350, vwBudget: 93 }),
				},
				categoryLabel: product.category ? sentenceCase(product.category.name) : "New in",
				pairs: [...pairs, ...fill].slice(0, 4),
			},
		];
	});
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
	};
}

/**
 * A plain-text summary split into prose and labelled facts: catalogue descriptions often carry
 * "MATERIAL: …" lines, which read better as the product page's accordion rows.
 */
export function splitSummary(summary: string | null | undefined, productName: string) {
	const name = productName.replace(/\s+/g, " ").trim().toLowerCase();
	const lines = (summary ?? "")
		.split(/\r?\n/)
		.map((line) => line.replace(/\s+/g, " ").trim())
		.filter((line) => line && line.toLowerCase() !== name);
	const factPattern = /^([\p{Lu}][\p{Lu}\s]{2,30}):\s*(.+)$/u;
	const facts = lines.flatMap((line) => {
		const match = line.match(factPattern);
		return match?.[1] && match[2] ? [{ label: sentenceCase(match[1].toLowerCase()), text: match[2] }] : [];
	});
	const prose = lines.filter((line) => !factPattern.test(line));
	return { prose, facts };
}

/** The section rows' shared type size: the longest name fills its row beside the arrow. */
export function sectionRowSize(sections: readonly { name: string }[]) {
	const names = sections.map((section) => section.name);
	return {
		mobile: fitDisplaySizeAll(names, { maxPx: 56, budgetPx: 262, vwBudget: 70 }),
		desktop: fitDisplaySizeAll(names, { maxPx: 190, budgetPx: 1100, vwBudget: 66 }),
	};
}
