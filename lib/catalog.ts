import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";

export type NavLink = { href: string; label: string };
export type Chip = { href: string; label: string };

const shortMoney = (formatted: string) => formatted.replace(/\.00(?=\D*$)/, "");

/** The store's own facts for the banner, hero, spec cards and footer: nothing invented. */
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
		.map(([network, href]) => ({ network, href }));
	return {
		storeName: me?.store.name || "Your Next Store",
		storeDescription: settings?.storeDescription || null,
		freeShipping: threshold ? shortMoney(formatMoney({ amount: BigInt(threshold), currency, locale })) : null,
		blog: tools?.blog ?? false,
		contact: tools?.contactForm ?? false,
		socialLinks,
	};
}

/** A manual collection with no members (or a smart one with no rules) would open on an empty grid. */
export const hasMembers = (c: { productCollections?: unknown[] | null; metafieldRules?: unknown[] | null }) =>
	(c.productCollections?.length ?? 0) > 0 || (c.metafieldRules?.length ?? 0) > 0;

export async function getNavLinks(): Promise<NavLink[]> {
	"use cache";
	cacheLife("hours");
	const [collections, info] = await Promise.all([
		commerce.collectionBrowse({ limit: 3 }).catch(() => ({ data: [] })),
		getStoreInfo(),
	]);
	return [
		{ href: "/", label: "Home" },
		{ href: "/products", label: "Shop" },
		...collections.data.filter(hasMembers).map((c) => ({ href: `/collection/${c.slug}`, label: c.name })),
		{ href: "/about", label: "About" },
		...(info.contact ? [{ href: "/contact", label: "Contact" }] : []),
		...(info.blog ? [{ href: "/blog", label: "Blog" }] : []),
	];
}

/**
 * The original's category marquee. Categories first; a store with fewer than five tops the row
 * up with its collections and then product names, so the strip never looks empty.
 */
export async function getMarqueeChips(): Promise<Chip[]> {
	"use cache";
	cacheLife("hours");
	const [categories, collections, products] = await Promise.all([
		commerce.categoriesBrowse({ limit: 12 }).catch(() => ({ data: [] })),
		commerce.collectionBrowse({ limit: 6 }).catch(() => ({ data: [] })),
		commerce.productBrowse({ active: true, limit: 12 }).catch(() => ({ data: [] })),
	]);
	const chips: Chip[] = [
		...categories.data
			.filter((c) => !c.parentId)
			.map((c) => ({
				href: `/category/${c.slug}`,
				label: c.name.split(">").at(-1)?.trim() || c.name,
			})),
	];
	if (chips.length < 5) {
		chips.push(
			...collections.data.filter(hasMembers).map((c) => ({ href: `/collection/${c.slug}`, label: c.name })),
		);
	}
	if (chips.length < 5) {
		chips.push(...products.data.map((p) => ({ href: `/product/${p.slug}`, label: p.name })));
	}
	return chips.slice(0, 12);
}

export async function getHomeProducts() {
	"use cache";
	cacheLife("minutes");
	const [latest, all, config] = await Promise.all([
		commerce
			.productBrowse({ active: true, limit: 8, orderBy: "createdAt", orderDirection: "desc" })
			.catch(() => ({ data: [], meta: { count: 0 } })),
		commerce.productBrowse({ active: true, limit: 100 }).catch(() => ({ data: [], meta: { count: 0 } })),
		getStoreConfig(),
	]);
	const { currency, locale, taxBehavior } = config;
	// Free or unpriced variants (e.g. a configurable set priced 0) would print "Starts from $0".
	const lows = all.data.flatMap((p) => {
		const priced = p.variants.filter((v) => Number(v.price) > 0);
		return priced.length ? [priceRange(priced, taxBehavior).min] : [];
	});
	const low = lows.reduce<bigint | null>((acc, v) => (acc === null || v < acc ? v : acc), null);
	const withImages = all.data.filter((p) => p.images[0]);
	// Photographed products first, so a shelf never opens on an empty grey tile.
	const pictured = <T extends { images: string[] }>(list: T[]) => [
		...list.filter((p) => p.images[0]),
		...list.filter((p) => !p.images[0]),
	];
	return {
		latest: pictured(latest.data).slice(0, 4),
		featured: pictured(all.data).slice(0, 8),
		count: all.meta.count,
		startsFrom: low === null ? null : formatMoney({ amount: low, currency, locale }),
		tileA: withImages.at(-1) ?? null,
		tileB: withImages[Math.floor(withImages.length / 2)] ?? null,
	};
}
