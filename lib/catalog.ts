import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { getStoreConfig } from "@/lib/store-config";

export type NavLink = { href: string; label: string };

/** Collection descriptions are plain text or TipTap JSON; flatten either to one line of copy. */
export function plainText(value: unknown): string {
	if (typeof value === "string") return value.replace(/\s+/g, " ").trim();
	if (value && typeof value === "object") {
		const node = value as { text?: unknown; content?: unknown };
		const own = typeof node.text === "string" ? node.text : "";
		const children = Array.isArray(node.content) ? node.content.map(plainText).join(" ") : "";
		return `${own} ${children}`.replace(/\s+/g, " ").trim();
	}
	return "";
}

/**
 * Editorial photography (generated, see NOTICE.md) for Horizon's lifestyle slots: hero, the three
 * portrait cards, "Caring for you" and the About portrait. Product cards keep the store's photos.
 */
export const EDITORIAL = {
	hero: "/images/pexels/hero.jpg",
	shelf: ["/images/pexels/shelf-1.jpg", "/images/pexels/shelf-2.jpg", "/images/pexels/shelf-3.jpg"],
	caring: "/images/pexels/caring.jpg",
	about: "/images/pexels/about.jpg",
} as const;

type CollectionLike = {
	slug: string;
	name: string;
	description?: unknown;
	productCollections?: unknown[] | null;
	metafieldRules?: unknown[] | null;
};

/** A manual collection with no members renders an empty page, so it never gets a card or a nav link. */
function hasProducts(collection: CollectionLike) {
	return (collection.productCollections?.length ?? 0) > 0 || (collection.metafieldRules?.length ?? 0) > 0;
}

async function getCollections() {
	"use cache";
	cacheLife("hours");
	const collections = await commerce.collectionBrowse({ limit: 12 }).catch(() => ({ data: [] }));
	return collections.data.filter(hasProducts);
}

/** Top-level categories that hold at least one product, in the store's order. */
async function getCategories() {
	"use cache";
	cacheLife("hours");
	const categories = await commerce.categoriesBrowse({ limit: 20 }).catch(() => ({ data: [] }));
	const roots = categories.data.filter((category) => !category.parentId && category.active !== false);
	const counted = await Promise.all(
		roots.slice(0, 6).map(async (category) => {
			const products = await commerce
				.productBrowse({ active: true, limit: 1, category: category.slug })
				.catch(() => ({ data: [] }));
			return products.data.length > 0 ? [category] : [];
		}),
	);
	return counted.flat();
}

async function freeShippingLabel() {
	const [me, { currency, locale }] = await Promise.all([meGetCached().catch(() => null), getStoreConfig()]);
	const threshold = Number(me?.store.settings?.freeShippingThreshold ?? 0);
	if (!threshold) return null;
	return `Free shipping on every order over ${formatMoney({ amount: BigInt(threshold), currency, locale }).replace(/\.00(?=\D*$)/, "")}.`;
}

export type ShelfCard = { href: string; title: string; description: string; image: string };

// The original's three category cards: "Shop all", then the collections and top-level categories
// that hold products, each over one of the three editorial photos.
async function shelf(): Promise<ShelfCard[]> {
	const [collections, categories] = await Promise.all([getCollections(), getCategories()]);
	const entries = [
		{
			href: "/products",
			title: "Shop all",
			description: "Everything in the store, in one place.",
		},
		...collections.map((collection) => ({
			href: `/collection/${collection.slug}`,
			title: collection.name,
			description: plainText(collection.description) || `Everything in ${collection.name}, in one place.`,
		})),
		...categories.map((category) => ({
			href: `/category/${category.slug}`,
			title: category.name,
			description: plainText(category.description) || `Browse ${category.name}.`,
		})),
	];
	return entries.slice(0, 3).map((entry, index) => ({
		...entry,
		image: EDITORIAL.shelf[index % EDITORIAL.shelf.length] ?? EDITORIAL.hero,
	}));
}

/** Products with a photo first, so rails never open on an empty frame. */
function photographedFirst<T extends { images?: string[] | null }>(products: T[]): T[] {
	const hasPhoto = (product: T) => (product.images?.length ?? 0) > 0;
	return [...products.filter(hasPhoto), ...products.filter((product) => !hasPhoto(product))];
}

export async function getHeaderData() {
	"use cache";
	cacheLife("hours");
	const [collections, me, shipping] = await Promise.all([
		getCollections(),
		meGetCached().catch(() => null),
		freeShippingLabel(),
	]);
	const tools = me?.store.settings?.enabledTools;
	const links: NavLink[] = [
		{ href: "/products", label: "Shop" },
		...collections.slice(0, 2).map((collection) => ({
			href: `/collection/${collection.slug}`,
			label: collection.name,
		})),
		{ href: "/about", label: "About" },
		...(tools?.blog ? [{ href: "/blog", label: "Learn" }] : []),
	];
	const announcement =
		shipping || me?.store.settings?.storeDescription || "Everyday things, chosen with care.";
	return { storeName: me?.store.name || "Your Next Store", links, announcement };
}

export async function getHomeData() {
	"use cache";
	cacheLife("minutes");
	const [products, cards] = await Promise.all([
		commerce.productBrowse({ active: true, limit: 12 }).catch(() => ({ data: [] })),
		shelf(),
	]);
	return { products: photographedFirst(products.data).slice(0, 6), shelf: cards };
}

export async function getShelf() {
	"use cache";
	cacheLife("hours");
	return shelf();
}

export async function getFooterData() {
	"use cache";
	cacheLife("hours");
	const [me, legal, socials, collections] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		commerce.socialsGet().catch(() => null),
		getCollections(),
	]);
	const tools = me?.store.settings?.enabledTools;
	const labels = {
		instagram: "Instagram",
		tiktok: "TikTok",
		facebook: "Facebook",
		x: "X",
		youtube: "YouTube",
		linkedin: "LinkedIn",
	} as const;
	const social = socials
		? Object.entries(labels).flatMap(([key, label]) => {
				const href = socials.socials[key as keyof typeof labels];
				return href ? [{ href, label }] : [];
			})
		: [];
	return {
		storeName: me?.store.name || "Your Next Store",
		newsletter: tools?.newsletter ?? false,
		shop: [
			{ href: "/products", label: "All products" },
			...collections.slice(0, 4).map((collection) => ({
				href: `/collection/${collection.slug}`,
				label: collection.name,
			})),
		],
		company: [
			{ href: "/about", label: "About us" },
			{ href: "/faq", label: "FAQ" },
			...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
			...(tools?.blog ? [{ href: "/blog", label: "Journal" }] : []),
		],
		legal: legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
		social,
		year: new Date().getFullYear(),
	};
}
