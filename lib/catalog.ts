import { cacheLife } from "next/cache";
import type { PickItem } from "@/components/halfstep/picker";
import { commerce, meGetCached } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";

export type NavLink = { href: string; label: string };

/** A manual collection without members opens an empty page, so it is never linked. */
export const hasMembers = (c: {
	productCollections?: readonly unknown[] | null;
	metafieldRules?: readonly unknown[] | null;
}) => (c.productCollections?.length ?? 0) > 0 || (c.metafieldRules?.length ?? 0) > 0;

/** Editorial fallback (Pexels, credited in NOTICE.md) for a collection without its own image. */
export const COLLECTION_FALLBACK_IMAGE = "/images/pexels/collection-still-life.jpg";

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

/** Splits a name so its last word can carry the signal colour, as "flattened." did. */
export function splitTitle(name: string): [string, string] {
	const words = name.trim().split(/\s+/);
	if (words.length < 2) return ["", name];
	return [words.slice(0, -1).join(" "), words.at(-1) ?? ""];
}

async function freeShippingLabel() {
	const [me, { currency, locale }] = await Promise.all([meGetCached().catch(() => null), getStoreConfig()]);
	const threshold = Number(me?.store.settings?.freeShippingThreshold ?? 0);
	if (!threshold) return null;
	return `Free shipping over ${formatMoney({ amount: BigInt(threshold), currency, locale }).replace(/\.00(?=\D*$)/, "")}`;
}

// The original's in-page anchors become the shop's sections.
export async function getHeaderData() {
	"use cache";
	cacheLife("hours");
	const [collections, me] = await Promise.all([
		commerce.collectionBrowse({ limit: 10 }).catch(() => ({ data: [] })),
		meGetCached().catch(() => null),
	]);
	const tools = me?.store.settings?.enabledTools;
	const links: NavLink[] = [
		{ href: "/products", label: "Shop" },
		...collections.data
			.filter(hasMembers)
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

export async function getShippingLabel() {
	"use cache";
	cacheLife("hours");
	return freeShippingLabel();
}

export async function getHomeData() {
	"use cache";
	cacheLife("minutes");
	const [products, collections, me, config, shipping] = await Promise.all([
		commerce.productBrowse({ active: true, limit: 24 }).catch(() => ({ data: [], meta: { count: 0 } })),
		commerce.collectionBrowse({ limit: 10 }).catch(() => ({ data: [] })),
		meGetCached().catch(() => null),
		getStoreConfig(),
		freeShippingLabel(),
	]);
	const { currency, locale, taxBehavior } = config;
	// Pictured, priced products lead every row; image-less or zero-priced ones go last.
	const shown = (p: (typeof products.data)[number]) =>
		(p.images?.length ?? 0) > 0 && p.variants.some((v) => Number(v.price) > 0);
	const ordered = [...products.data.filter(shown), ...products.data.filter((p) => !shown(p))];
	const withPrices = ordered.map((product) => {
		const range = product.variants.length > 0 ? priceRange(product.variants, taxBehavior) : null;
		return { product, min: range?.min ?? null };
	});
	const prices = withPrices.flatMap(({ min }) => (min === null || min <= 0n ? [] : [min]));
	const lowest = prices.reduce<bigint | null>(
		(acc, price) => (acc === null || price < acc ? price : acc),
		null,
	);
	const featured = ordered[0] ?? null;
	// The picker opens on its first item, so buyable pieces come first.
	const buyable = (p: (typeof products.data)[number]) =>
		p.variants.some((v) => v.stock === null || (v.stock ?? 0) > 0);
	const picks: PickItem[] = withPrices
		.filter(({ product }) => shown(product))
		.sort((a, b) => Number(buyable(b.product)) - Number(buyable(a.product)))
		.slice(0, 6)
		.map(({ product, min }) => {
			const only = product.variants.length === 1 ? product.variants[0] : null;
			return {
				id: product.id,
				slug: product.slug,
				name: product.name,
				summary: product.summary ?? null,
				image: product.images[0] ?? only?.images[0] ?? null,
				amount: min === null ? null : min.toString(),
				variantCount: product.variants.length,
				variant: only
					? {
							id: only.id,
							sku: only.sku ?? null,
							price: only.price,
							priceGross: only.priceGross ?? null,
							images: only.images,
							stock: only.stock ?? null,
						}
					: null,
			};
		});

	return {
		storeName: me?.store.name || "Your Next Store",
		storeDescription: me?.store.settings?.storeDescription || null,
		products: ordered,
		productCount: products.meta.count,
		collections: collections.data.filter(hasMembers).map((collection) => ({
			id: collection.id,
			slug: collection.slug,
			name: collection.name,
			image: collection.image ?? COLLECTION_FALLBACK_IMAGE,
			description: plainText(collection.description),
		})),
		featured,
		picks,
		cards: withPrices.map(({ product, min }) => ({
			id: product.id,
			slug: product.slug,
			name: product.name,
			summary: product.summary ?? null,
			image: product.images[0] ?? product.variants[0]?.images[0] ?? null,
			price: min === null ? null : formatMoney({ amount: min, currency, locale }),
			variantCount: product.variants.length,
		})),
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
		commerce.collectionBrowse({ limit: 10 }).catch(() => ({ data: [] })),
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
				.filter(hasMembers)
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
