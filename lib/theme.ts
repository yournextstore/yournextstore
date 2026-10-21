import { cacheLife } from "next/cache";
import { try_ } from "safe-try";
import { commerce, meGetCached } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { displayPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { isVideoUrl } from "@/lib/utils";

/** Store identity for the chrome: display name, tagline, free-shipping line and optional tools. */
export async function getStoreIdentity() {
	"use cache";
	cacheLife("hours");

	const [error, me] = await try_(meGetCached());
	if (error) {
		return {
			name: "Your Next Store",
			description: null,
			freeShipping: null,
			freeShippingThreshold: null,
			blogEnabled: false,
			contactEnabled: false,
			newsletterEnabled: false,
		};
	}
	const settings = me.store.settings;
	const threshold = settings?.freeShippingThreshold ? BigInt(settings.freeShippingThreshold) : null;
	const { currency, locale } = await getStoreConfig();

	return {
		name: settings?.storeName || me.store.name || "Your Next Store",
		description: settings?.storeDescription || null,
		freeShipping: threshold && threshold > 0n ? formatMoney({ amount: threshold, currency, locale }) : null,
		freeShippingThreshold: threshold && threshold > 0n ? threshold.toString() : null,
		blogEnabled: settings?.enabledTools?.blog ?? false,
		contactEnabled: settings?.enabledTools?.contactForm ?? false,
		newsletterEnabled: settings?.enabledTools?.newsletter ?? false,
	};
}

/** Category names are stored as typed in the admin; take the last path segment and capitalise. */
export function displayName(name: string) {
	const last = name.split(">").at(-1)?.trim() ?? name;
	return last.charAt(0).toUpperCase() + last.slice(1);
}

/** Collection and category descriptions are TipTap JSON (or plain strings): flatten to one line. */
export function plainText(value: unknown): string {
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (trimmed.startsWith("{")) {
			try {
				return plainText(JSON.parse(trimmed) as unknown);
			} catch {
				return trimmed;
			}
		}
		return trimmed;
	}
	if (!value || typeof value !== "object") return "";
	if ("text" in value && typeof value.text === "string") return value.text;
	if ("content" in value && Array.isArray(value.content)) {
		return value.content
			.map((child: unknown) => plainText(child))
			.filter(Boolean)
			.join(" ")
			.replace(/\s+/g, " ")
			.trim();
	}
	return "";
}

export function pick<T>(items: T[], index: number): T | undefined {
	return items.length > 0 ? items[index % items.length] : undefined;
}

const stills = (images: string[] | null | undefined) => (images ?? []).filter((url) => !isVideoUrl(url));

export type Shot = { src: string; href: string; name: string };

/**
 * Editorial photography bundled with the theme (generated, see NOTICE.md): the hero, the
 * image-with-text band, the gallery, the about page and the collection banner fallback.
 * Product cards, product pages and the cart keep the store's own pictures.
 */
export const EDITORIAL = {
	hero: { src: "/images/pexels/hero-hat-bag.jpg", alt: "A bed made with oat linen bedding and clay pillows" },
	story: {
		src: "/images/pexels/knit-bag-flatlay.jpg",
		alt: "Rumpled linen bedding with a wool throw and a cup of tea",
	},
	gallery: [
		{ src: "/images/pexels/woven-bag.jpg", alt: "Folded linen sheets in oat, clay and sage on a shelf" },
		{ src: "/images/pexels/hanger-sunglasses.jpg", alt: "A linen towel hanging on a peg rail" },
		{ src: "/images/pexels/chair-vase.jpg", alt: "Dried grasses and a linen napkin on a wooden chair" },
		{ src: "/images/pexels/sunglasses-desk.jpg", alt: "A breakfast table laid with a linen tablecloth" },
	],
	aboutHero: { src: "/images/pexels/ceramics.jpg", alt: "" },
	aboutStory: { src: "/images/pexels/knit-basket.jpg", alt: "" },
	banner: { src: "/images/pexels/beige-jacket.jpg", alt: "" },
} as const;

/**
 * The store's own pictures, used where a product or collection tile has no image of its own:
 * collection images first, then the second photo of products with a gallery, then packshots.
 * `pick(i)` wraps, so a one-photo store fills every slot.
 */
export async function getLifestyleShots() {
	"use cache";
	cacheLife("minutes");

	const [collections, products] = await Promise.all([
		commerce.collectionBrowse({ limit: 50 }).catch(() => ({ data: [] })),
		commerce
			.productBrowse({ active: true, limit: 40, orderBy: "createdAt", orderDirection: "desc" })
			.catch(() => ({ data: [] })),
	]);
	const rooms: Shot[] = collections.data.flatMap((c) =>
		c.image ? [{ src: c.image, href: `/collection/${c.slug}`, name: c.name }] : [],
	);
	const second: Shot[] = products.data.flatMap((p) => {
		const src = stills(p.images)[1];
		return src ? [{ src, href: `/product/${p.slug}`, name: p.name }] : [];
	});
	const packshots: Shot[] = products.data.flatMap((p) => {
		const src = stills(p.images)[0];
		return src ? [{ src, href: `/product/${p.slug}`, name: p.name }] : [];
	});
	const unique = (list: Shot[]) => [...new Map(list.map((s) => [s.src, s])).values()];
	const lifestyle = unique([...rooms, ...second]);
	return { lifestyle: lifestyle.length > 0 ? lifestyle : unique(packshots), packshots: unique(packshots) };
}

export type Tile = { href: string; title: string; image: string | null; kind: "category" | "collection" };

/**
 * "Explore collections" mosaic: the store's categories (pictured by one of their products) and
 * collections (their own image, else a member's photo), categories first.
 */
export async function getCatalogueTiles() {
	"use cache";
	cacheLife("minutes");

	const [facets, collections] = await Promise.all([
		commerce.productFilters().catch(() => ({ categories: [] })),
		commerce.collectionBrowse({ limit: 50 }).catch(() => ({ data: [] })),
	]);
	const categories = await Promise.all(
		facets.categories.map(async (category) => {
			const result = await commerce
				.productBrowse({ active: true, category: category.slug, limit: 4 })
				.catch(() => ({ data: [], meta: { count: 0 } }));
			const image = result.data.flatMap((p) => stills(p.images))[0] ?? null;
			return {
				tile: {
					href: `/category/${category.slug}`,
					title: displayName(category.name),
					image,
					kind: "category" as const,
				},
				count: result.meta.count,
			};
		}),
	);
	// A manual collection with no members would open on an empty grid.
	const filled = collections.data.filter(
		(c) => (c.productCollections?.length ?? 0) > 0 || (c.metafieldRules?.length ?? 0) > 0,
	);
	const collectionTiles: Tile[] = filled.map((c) => ({
		href: `/collection/${c.slug}`,
		title: c.name,
		image: c.image ?? null,
		kind: "collection",
	}));
	return {
		categories: categories.filter((c) => c.count > 0).map((c) => c.tile),
		collections: collectionTiles,
	};
}

export type LookProduct = { slug: string; name: string; image: string | null; price: string | null };

export type Look = {
	slug: string;
	name: string;
	description: string;
	image: string | null;
	products: LookProduct[];
};

/**
 * Collections with their members resolved to name, photo and display price: drives the
 * shop-the-look hotspots and the dark tab band.
 */
export async function getLooks(): Promise<Look[]> {
	"use cache";
	cacheLife("minutes");

	const [collections, { currency, locale, taxBehavior }] = await Promise.all([
		commerce.collectionBrowse({ limit: 6 }).catch(() => ({ data: [] })),
		getStoreConfig(),
	]);
	return Promise.all(
		collections.data.map(async (c) => {
			const full = await commerce.collectionGet({ idOrSlug: c.slug }).catch(() => null);
			const members = (full?.productCollections ?? []).slice(0, 4);
			const products = await Promise.all(
				members.map(async ({ product }) => {
					const detail = await commerce.productGet({ idOrSlug: product.slug }).catch(() => null);
					const variant = detail?.variants[0];
					const price = variant ? displayPrice(variant, taxBehavior) : null;
					return {
						slug: product.slug,
						name: product.name,
						image: stills(product.images)[0] ?? null,
						price: price ? formatMoney({ amount: BigInt(price), currency, locale }) : null,
					};
				}),
			);
			return {
				slug: c.slug,
				name: c.name,
				description: plainText(c.description),
				image: c.image ?? null,
				products,
			};
		}),
	);
}

export async function getSocialLinks() {
	"use cache";
	cacheLife("hours");
	const labels: Record<string, string> = {
		instagram: "Instagram",
		facebook: "Facebook",
		x: "X",
		youtube: "YouTube",
		linkedin: "LinkedIn",
		tiktok: "TikTok",
		pinterest: "Pinterest",
	};
	const socials = await commerce.socialsGet().catch(() => null);
	return Object.entries(socials?.socials ?? {}).flatMap(([network, url]) =>
		typeof url === "string" && url && labels[network] ? [{ label: labels[network], url }] : [],
	);
}

/**
 * "Become a Reseller": the original posts a B2B sign-up form to Shopify. The platform's only
 * form for it is the contact form, so the link goes there when the store runs it, else to the
 * contact block on the about page.
 */
export function resellerHref(contactEnabled: boolean) {
	return contactEnabled ? "/contact" : "/about#contact";
}
