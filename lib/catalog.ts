import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { ALL_PRODUCTS_TILE_IMAGE, pickEditorial } from "@/lib/editorial";

/** Store facts for the header, footer and about page: nothing invented. */
export async function getStoreInfo() {
	"use cache";
	cacheLife("hours");
	const [me, socials, legal] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.socialsGet().catch(() => null),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);
	const settings = me?.store.settings;
	const tools = settings?.enabledTools;
	const socialLinks = Object.entries(socials?.socials ?? {})
		.filter((entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].startsWith("http"))
		.map(([network, href]) => ({
			network,
			label: network === "x" ? "X" : network.charAt(0).toUpperCase() + network.slice(1),
			href,
		}));
	const threshold = Number(settings?.freeShippingThreshold ?? 0);
	return {
		storeName: me?.store.name || "Your Next Store",
		storeDescription: settings?.storeDescription || null,
		currency: me?.store.currency || "USD",
		locale: settings?.defaultLanguage || me?.store.locale || "en-US",
		freeShippingThreshold: Number.isFinite(threshold) && threshold > 0 ? threshold : null,
		blog: tools?.blog ?? false,
		contact: tools?.contactForm ?? false,
		socialLinks,
		legalPages: legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
	};
}

export type CollectionTile = {
	href: string;
	title: string;
	image: string | null;
	count: number;
};

type Browsable = { href: string; title: string; count: number };

/** Collections that open a filled page (a manual one without members stays out), then top categories. */
async function getBrowsables(): Promise<Browsable[]> {
	"use cache";
	cacheLife("hours");
	const [collections, categories] = await Promise.all([
		commerce.collectionBrowse({ limit: 50 }).catch(() => ({ data: [] })),
		commerce.categoriesBrowse({ active: true, limit: 100 }).catch(() => ({ data: [] })),
	]);
	const filled = collections.data.filter(
		(c) => (c.productCollections?.length ?? 0) > 0 || (c.metafieldRules?.length ?? 0) > 0,
	);
	const counted = await Promise.all([
		...filled.map(async (collection) => ({
			href: `/collection/${collection.slug}`,
			title: collection.name,
			count: await commerce
				.productBrowse({ active: true, limit: 1, collection: collection.slug })
				.then((result) => result.meta.count)
				.catch(() => 0),
		})),
		...categories.data
			.filter((category) => !category.parentId)
			.map(async (category) => ({
				href: `/category/${category.slug}`,
				title: category.name,
				count: await commerce
					.productBrowse({ active: true, limit: 1, category: category.slug })
					.then((result) => result.meta.count)
					.catch(() => 0),
			})),
	]);
	return counted.filter((item) => item.count > 0);
}

/**
 * The original's "Collections" carousel: collections and top categories with an editorial photo and
 * item count, the full catalogue as the last tile, cut to whole rows of three on desktop.
 */
export async function getCollectionTiles(): Promise<CollectionTile[]> {
	"use cache";
	cacheLife("hours");
	const [browsables, all] = await Promise.all([
		getBrowsables(),
		commerce.productBrowse({ active: true, limit: 1 }).catch(() => ({ data: [], meta: { count: 0 } })),
	]);
	const rowLength = Math.max(3, Math.floor((browsables.length + 1) / 3) * 3);
	const picked = browsables.slice(0, rowLength - 1);
	const images = pickEditorial(
		picked.map((item) => item.title),
		"tile",
		[ALL_PRODUCTS_TILE_IMAGE],
	);
	return [
		...picked.map((item, i) => ({ ...item, image: images[i] ?? null })),
		{ href: "/products", title: "All Products", image: ALL_PRODUCTS_TILE_IMAGE, count: all.meta.count },
	];
}

export type HeroSlide = {
	kind: "scene" | "product";
	kicker: string | null;
	title: string;
	href: string;
	image: string;
};

const firstClause = (text: string) => {
	const sentence = text.split(/[.!?]/)[0]?.trim() ?? "";
	return sentence.length > 70 ? `${sentence.slice(0, 67).trimEnd()}…` : sentence;
};

const lowestPrice = (product: { variants: { price: string }[] }) =>
	Math.min(...product.variants.map((variant) => Number(variant.price)).filter((price) => price > 0));

/**
 * The original's banner slider (kicker, title, Shop Now): two editorial scenes for the store's first
 * collections or categories, then its two dearest pictured products as cut-out slides.
 */
export async function getHeroSlides(): Promise<HeroSlide[]> {
	"use cache";
	cacheLife("hours");
	const [browsables, products] = await Promise.all([
		getBrowsables(),
		commerce.productBrowse({ active: true, limit: 100 }).catch(() => ({ data: [] })),
	]);
	const sceneItems = browsables.slice(0, 2);
	const sceneImages = pickEditorial(
		sceneItems.map((item) => item.title),
		"hero",
	);
	const scenes = sceneItems.map((item, i) => ({
		kind: "scene" as const,
		kicker: `${item.count} ${item.count === 1 ? "item" : "items"} to explore`,
		title: item.title,
		href: item.href,
		image: sceneImages[i] ?? "",
	}));
	// The API's price ordering is unreliable: sort here, skipping free and unpictured products.
	const items = products.data
		.filter((product) => product.images[0] && Number.isFinite(lowestPrice(product)))
		.sort((a, b) => lowestPrice(b) - lowestPrice(a))
		.slice(0, 2)
		.map((product) => ({
			kind: "product" as const,
			kicker: product.summary ? firstClause(product.summary) : null,
			title: product.name,
			href: `/product/${product.slug}`,
			image: product.images[0] ?? "",
		}));
	return [...scenes, ...items].slice(0, 4);
}

/** Featured row and "Pick of the week" call to action share one cached browse. */
export async function getHomeProducts() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({ active: true, limit: 24 }).catch(() => ({ data: [] }));
	// Pictured, priced products first, so the featured row never opens on a placeholder or a free set.
	const rank = (product: (typeof data)[number]) =>
		(product.images.length > 0 || product.variants.some((variant) => (variant.images?.length ?? 0) > 0)
			? 0
			: 2) + (product.variants.some((variant) => Number(variant.price) > 0) ? 0 : 1);
	return data
		.map((product, index) => ({ product, index }))
		.sort((a, b) => rank(a.product) - rank(b.product) || a.index - b.index)
		.slice(0, 12)
		.map(({ product }) => product);
}
