import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
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

/** Splits a name so its last word can carry the gilt gradient, as "Aether One" did. */
export function splitTitle(name: string): [string, string] {
	const words = name.trim().split(/\s+/);
	if (words.length < 2) return ["", name];
	return [words.slice(0, -1).join(" "), words.at(-1) ?? ""];
}

type BrowsedCollection = {
	productCollections: readonly unknown[];
	metafieldRules?: readonly unknown[] | null;
};

/** Manual collections with no members (and no rules) would open on an empty page: leave them out. */
export function hasProducts(collection: BrowsedCollection) {
	return collection.productCollections.length > 0 || (collection.metafieldRules?.length ?? 0) > 0;
}

/** Editorial photograph (Pexels, see NOTICE.md) for the home collections stage. */
export const overviewImage = {
	src: "/images/pexels/evening-bag.jpg",
	alt: "Black over-ear headphones on a leather armchair beside a record player, lit by a warm floor lamp",
};

async function freeShippingLabel() {
	const [me, { currency, locale }] = await Promise.all([meGetCached().catch(() => null), getStoreConfig()]);
	const threshold = Number(me?.store.settings?.freeShippingThreshold ?? 0);
	if (!threshold) return null;
	return `Free shipping over ${formatMoney({ amount: BigInt(threshold), currency, locale }).replace(/\.00(?=\D*$)/, "")}`;
}

// The original's four in-page anchors become the shop's sections: everything, each collection, about.
export async function getHeaderData() {
	"use cache";
	cacheLife("hours");
	const [collections, me] = await Promise.all([
		commerce.collectionBrowse({ limit: 20 }).catch(() => ({ data: [] })),
		meGetCached().catch(() => null),
	]);
	const tools = me?.store.settings?.enabledTools;
	const links: NavLink[] = [
		{ href: "/products", label: "Shop" },
		...collections.data
			.filter(hasProducts)
			.slice(0, 3)
			.map((collection) => ({
				href: `/collection/${collection.slug}`,
				label: collection.name,
			})),
		{ href: "/about", label: "About" },
		...(tools?.blog ? [{ href: "/blog", label: "Journal" }] : []),
	];
	return { storeName: me?.store.name || "Your Next Store", links };
}

export async function getHomeData() {
	"use cache";
	cacheLife("minutes");
	const [products, collections, me, config, shipping] = await Promise.all([
		commerce.productBrowse({ active: true, limit: 100 }).catch(() => ({ data: [], meta: { count: 0 } })),
		commerce.collectionBrowse({ limit: 20 }).catch(() => ({ data: [] })),
		meGetCached().catch(() => null),
		getStoreConfig(),
		freeShippingLabel(),
	]);
	const { currency, locale, taxBehavior } = config;
	const withPrices = products.data.map((product) => {
		const range = product.variants.length > 0 ? priceRange(product.variants, taxBehavior) : null;
		return { product, min: range?.min ?? null };
	});
	// A zero price is a set or bundle priced by its parts: it would read "from $0" and cannot lead.
	const priced = withPrices.filter(({ min }) => min !== null && min > 0n);
	const lowest = priced.reduce<bigint | null>(
		(acc, { min }) => (min !== null && (acc === null || min < acc) ? min : acc),
		null,
	);
	// Photographed, priced products first, so the stage and the panels never open on a blank frame.
	const pricedIds = new Set(priced.map(({ product }) => product.id));
	const leads = (product: (typeof products.data)[number]) =>
		product.images.length > 0 && pricedIds.has(product.id);
	const showcase = [...products.data.filter(leads), ...products.data.filter((product) => !leads(product))];
	const buyable = (product: (typeof products.data)[number]) =>
		product.variants.some((variant) => variant.stock === null || (variant.stock ?? 0) > 0);
	const featured =
		showcase.find((product) => leads(product) && buyable(product)) ?? showcase.find(leads) ?? null;

	return {
		storeName: me?.store.name || "Your Next Store",
		storeDescription: me?.store.settings?.storeDescription || null,
		products: showcase,
		productCount: products.meta.count,
		collections: collections.data.filter(hasProducts).map((collection) => ({
			id: collection.id,
			slug: collection.slug,
			name: collection.name,
			image: collection.image ?? null,
			description: plainText(collection.description),
		})),
		featured,
		featuredPrice:
			featured && featured.variants.length > 0
				? formatMoney({ amount: priceRange(featured.variants, taxBehavior).min, currency, locale })
				: null,
		priceFrom: lowest === null ? null : formatMoney({ amount: lowest, currency, locale }),
		shipping,
	};
}

export async function getFooterData() {
	"use cache";
	cacheLife("hours");
	const [me, legal, socials, collections, shipping] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		commerce.socialsGet().catch(() => null),
		commerce.collectionBrowse({ limit: 20 }).catch(() => ({ data: [] })),
		freeShippingLabel(),
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
		tagline: me?.store.settings?.storeDescription || null,
		shipping,
		links: [
			{ href: "/products", label: "Shop" },
			...collections.data
				.filter(hasProducts)
				.slice(0, 4)
				.map((collection) => ({
					href: `/collection/${collection.slug}`,
					label: collection.name,
				})),
			{ href: "/about", label: "About" },
			{ href: "/faq", label: "Support" },
			...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
			...(tools?.blog ? [{ href: "/blog", label: "Journal" }] : []),
		],
		legal: legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
		social,
		year: new Date().getFullYear(),
	};
}
