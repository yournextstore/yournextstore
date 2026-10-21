import { cacheLife } from "next/cache";
import { try_ } from "safe-try";
import { commerce, meGetCached } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { getStoreConfig } from "@/lib/store-config";

/** Store identity and the switches the theme's chrome reacts to. */
export async function getStoreInfo() {
	"use cache";
	cacheLife("hours");

	const [error, me] = await try_(meGetCached());
	if (error) {
		return {
			name: "Your Next Store",
			description: null,
			freeShippingThreshold: null,
			contactForm: false,
			blog: false,
		};
	}
	const settings = me.store.settings;
	const threshold = String(settings?.freeShippingThreshold ?? "");
	return {
		name: settings?.storeName || me.store.name || "Your Next Store",
		description: settings?.storeDescription?.trim() || null,
		freeShippingThreshold: /^\d+$/.test(threshold) && threshold !== "0" ? threshold : null,
		contactForm: settings?.enabledTools?.contactForm ?? false,
		blog: settings?.enabledTools?.blog ?? false,
	};
}

/** "Free shipping over $100" style amount, or null when the store has no threshold. */
export async function getFreeShippingLabel() {
	const [{ freeShippingThreshold }, { currency, locale }] = await Promise.all([
		getStoreInfo(),
		getStoreConfig(),
	]);
	return freeShippingThreshold
		? formatMoney({ amount: BigInt(freeShippingThreshold), currency, locale })
		: null;
}

/** Bundled editorial photos (generated, listed in NOTICE.md); product slots keep the store's images. */
export const editorial = {
	hero: "/images/pexels/hero-tote-green.jpg",
	about: "/images/pexels/about-tote-plant.jpg",
	shelf: [
		"/images/pexels/shelf-linen.jpg",
		"/images/pexels/shelf-sunglasses.jpg",
		"/images/pexels/shelf-folded.jpg",
	],
};

/** Photographed, priced products first; the rest keep their order at the end. */
export function photographedFirst<P extends { images: string[]; variants: { price: string }[] }>(
	products: readonly P[],
): P[] {
	const leads = (p: P) => p.images.length > 0 && p.variants.some((v) => Number(v.price) > 0);
	return [...products.filter(leads), ...products.filter((p) => !leads(p))];
}

/** Collections with products in them: an empty one would only lead to a blank page. */
export async function getCollections() {
	"use cache";
	cacheLife("hours");
	const [error, result] = await try_(commerce.collectionBrowse({ limit: 12 }));
	return error ? [] : result.data.filter((c) => c.productCollections.length > 0);
}

export const getFilledCollections = getCollections;

export async function getAllCategories() {
	"use cache";
	cacheLife("hours");
	const [error, result] = await try_(commerce.categoriesBrowse({ limit: 100 }));
	if (error) return [];
	return result.data.filter((category) => category.active !== false);
}

export async function getTopCategories() {
	const categories = await getAllCategories();
	return categories.filter((category) => !category.parentId);
}

/** Collection descriptions are plain text or TipTap JSON; the theme only ever shows a line of text. */
export function plainText(value: unknown): string {
	if (typeof value === "string") return value.trim();
	if (!value || typeof value !== "object") return "";
	const node = value as { text?: unknown; content?: unknown };
	const own = typeof node.text === "string" ? node.text : "";
	const children = Array.isArray(node.content) ? node.content.map(plainText).filter(Boolean).join(" ") : "";
	return `${own}${own && children ? " " : ""}${children}`.replace(/\s+/g, " ").trim();
}

/** First letter of the store name, for the square brand mark. */
export function monogram(name: string) {
	return (name.trim()[0] ?? "S").toUpperCase();
}
