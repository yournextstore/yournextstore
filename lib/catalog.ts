import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { plainText } from "@/lib/display";
import { pickEditorial } from "@/lib/editorial";
import { formatMoney } from "@/lib/money";
import { getStoreConfig } from "@/lib/store-config";

export type ShopLink = { href: string; label: string };

export type ShopTile = { href: string; label: string; image: string | null };

export type BannerSlide = {
	href: string;
	title: string;
	description: string | null;
	image: string;
};

const shortMoney = (formatted: string) => formatted.replace(/\.00(?=\D*$)/, "");

/** Category names on some stores are written as paths ("Lamps > Desk"): show the last segment. */
const leafName = (name: string) => name.split(">").at(-1)?.trim() || name;

/** The store's own facts for the top bar and footer: nothing invented. */
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
		.map(([network, href]) => ({
			label: network === "x" ? "X" : network.charAt(0).toUpperCase() + network.slice(1),
			href,
		}));
	return {
		storeName: me?.store.name || "Your Next Store",
		storeDescription: settings?.storeDescription || null,
		freeShipping: threshold ? shortMoney(formatMoney({ amount: BigInt(threshold), currency, locale })) : null,
		blog: tools?.blog ?? false,
		contact: tools?.contactForm ?? false,
		socialLinks,
	};
}

type CollectionLike = { productCollections?: unknown[] | null; metafieldRules?: unknown[] | null };

/** A manual collection without members opens an empty page, so it never shows up as a link. */
const isFilled = (collection: CollectionLike) =>
	(collection.productCollections?.length ?? 0) > 0 || (collection.metafieldRules?.length ?? 0) > 0;

/**
 * The original's "Categories" menu and "Shop" footer column. Top-level categories when the
 * store has them, its collections otherwise (or both, categories first).
 */
export async function getShopLinks() {
	"use cache";
	cacheLife("hours");
	const [categories, collections] = await Promise.all([
		commerce.categoriesBrowse({ active: true, limit: 12 }).catch(() => ({ data: [] })),
		commerce.collectionBrowse({ limit: 12 }).catch(() => ({ data: [] })),
	]);
	const categoryLinks: ShopLink[] = categories.data
		.filter((category) => !category.parentId)
		.map((category) => ({ href: `/category/${category.slug}`, label: leafName(category.name) }));
	const collectionLinks: ShopLink[] = collections.data.filter(isFilled).map((collection) => ({
		href: `/collection/${collection.slug}`,
		label: collection.name,
	}));
	return {
		label: categoryLinks.length > 0 ? "Categories" : "Collections",
		links: [...categoryLinks, ...collectionLinks],
	};
}

type ProductLike = { images: string[]; variants: { price: string }[] };

/** Photographed, priced products first: a card without a picture or price never leads a row. */
const rank = (product: ProductLike) =>
	(product.images.length > 0 ? 0 : 2) +
	(product.variants.some((variant) => Number(variant.price) > 0) ? 0 : 1);

export async function getProducts(limit: number) {
	"use cache";
	cacheLife("minutes");
	const result = await commerce
		.productBrowse({ active: true, limit: Math.max(limit, 48) })
		.catch(() => ({ data: [], meta: { count: 0 } }));
	return photographedFirst(result.data).slice(0, limit);
}

export function photographedFirst<T extends ProductLike>(products: readonly T[]): T[] {
	return products
		.map((product, index) => ({ product, index }))
		.sort((a, b) => rank(a.product) - rank(b.product) || a.index - b.index)
		.map(({ product }) => product);
}

/**
 * Home carousel: the original's pastel banners, one per shop section (all products, then the
 * store's categories and filled collections), each with an editorial photograph.
 */
export async function getBannerSlides(): Promise<BannerSlide[]> {
	"use cache";
	cacheLife("hours");
	const [info, categories, collections] = await Promise.all([
		getStoreInfo(),
		commerce.categoriesBrowse({ active: true, limit: 12 }).catch(() => ({ data: [] })),
		commerce.collectionBrowse({ limit: 12 }).catch(() => ({ data: [] })),
	]);
	const sections = [
		{ href: "/products", title: "Shop all products", description: info.storeDescription },
		...categories.data
			.filter((category) => !category.parentId)
			.map((category) => ({
				href: `/category/${category.slug}`,
				title: leafName(category.name),
				description: plainText(category.description) || null,
			})),
		...collections.data.filter(isFilled).map((collection) => ({
			href: `/collection/${collection.slug}`,
			title: collection.name,
			description: plainText(collection.description) || null,
		})),
	].slice(0, 4);
	const images = pickEditorial(sections.map((section) => section.title));
	return sections.map((section, index) => ({
		...section,
		description:
			section.description?.split(/(?<=\.)\s/)[0] || `Browse ${section.title.toLowerCase()} in one place.`,
		image: images[index] ?? "/images/pexels/sunglasses-yellow.jpg",
	}));
}

/**
 * The grey category tiles under the banner. Categories (pictured by their own image or their
 * first product), then collections, led by an "All products" tile so a thin catalogue still
 * fills a row.
 */
export async function getShopTiles(): Promise<ShopTile[]> {
	"use cache";
	cacheLife("hours");
	const [categories, collections, products] = await Promise.all([
		commerce.categoriesBrowse({ active: true, limit: 12 }).catch(() => ({ data: [] })),
		commerce.collectionBrowse({ limit: 12 }).catch(() => ({ data: [] })),
		getProducts(100),
	]);
	const imageAt = (index: number) => {
		const pictured = products.filter((product) => product.images.length > 0);
		return pictured.length > 0 ? (pictured[index % pictured.length]?.images[0] ?? null) : null;
	};
	const categoryTiles: ShopTile[] = categories.data
		.filter((category) => !category.parentId)
		.map((category) => ({
			href: `/category/${category.slug}`,
			label: leafName(category.name),
			image:
				category.image ?? products.find((product) => product.category?.id === category.id)?.images[0] ?? null,
		}));
	const collectionTiles: ShopTile[] = collections.data.filter(isFilled).map((collection, index) => ({
		href: `/collection/${collection.slug}`,
		label: collection.name,
		image: collection.image ?? imageAt(index + 1),
	}));
	return [
		{ href: "/products", label: "All products", image: imageAt(0) },
		...categoryTiles,
		...collectionTiles,
	].slice(0, 10);
}
