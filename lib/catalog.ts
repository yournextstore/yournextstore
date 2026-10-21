import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { plainText, shortName } from "@/lib/display";
import { BANNER_PRINTS, hasMembers } from "@/lib/editorial";

export type NavEntry = { href: string; label: string; description: string | null; image: string | null };
export type NavGroup = { label: string; href: string; entries: NavEntry[] };

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
			label: network === "x" ? "X" : network.charAt(0).toUpperCase() + network.slice(1),
			href,
		}));
	return {
		storeName: me?.store.name || "Your Next Store",
		storeDescription: settings?.storeDescription || null,
		blog: tools?.blog ?? false,
		contact: tools?.contactForm ?? false,
		socialLinks,
		legalPages: legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
	};
}

/**
 * The original's "Categories" and "Brands" menus: the store's top-level categories and its
 * collections, each pictured by its own image (or its first product's).
 */
export async function getNavGroups(): Promise<NavGroup[]> {
	"use cache";
	cacheLife("hours");
	const [categories, collections] = await Promise.all([
		commerce.categoriesBrowse({ limit: 12 }).catch(() => ({ data: [] })),
		commerce.collectionBrowse({ limit: 12 }).catch(() => ({ data: [] })),
	]);
	const groups: NavGroup[] = [
		{
			label: "Categories",
			href: "/products",
			entries: categories.data
				.filter((category) => !category.parentId)
				.map((category) => ({
					href: `/category/${category.slug}`,
					label: shortName(category.name),
					description: plainText(category.description) || null,
					image: category.image ?? null,
				})),
		},
		{
			label: "Collections",
			href: "/products",
			entries: collections.data.filter(hasMembers).map((collection) => ({
				href: `/collection/${collection.slug}`,
				label: collection.name,
				description: plainText(collection.description) || null,
				image: collection.image ?? null,
			})),
		},
	];
	return groups.filter((group) => group.entries.length > 0);
}

export type BannerSlide =
	| { kind: "collage"; title: string; kicker: string; href: string; cta: string; images: string[] }
	| { kind: "photo"; title: string; kicker: string; href: string; cta: string; image: string };

/**
 * The original's promo carousel. Its banners were artwork; here the first slide is a collage of
 * bundled editorial prints and each pictured collection with products adds a slide.
 */
export async function getBannerSlides(): Promise<BannerSlide[]> {
	"use cache";
	cacheLife("hours");
	const { data } = await commerce.collectionBrowse({ limit: 6 }).catch(() => ({ data: [] }));
	const collage: BannerSlide = {
		kind: "collage",
		kicker: "New in the shop",
		title: "Shop all products",
		href: "/products",
		cta: "Browse products",
		images: BANNER_PRINTS,
	};
	const pictured = data
		.filter((collection) => collection.image && hasMembers(collection))
		.map((collection) => ({
			kind: "photo" as const,
			kicker: "Collection",
			title: collection.name,
			href: `/collection/${collection.slug}`,
			cta: "Shop the collection",
			image: collection.image ?? "",
		}));
	return [collage, ...pictured];
}

type Pickable = {
	images?: string[] | null;
	variants?: { price: string; images?: string[] | null }[];
};

const hasPhoto = (p: Pickable) =>
	(p.images?.length ?? 0) > 0 || (p.variants ?? []).some((v) => (v.images?.length ?? 0) > 0);
// A zero-priced bundle or set would read "$0.00" on a card.
const hasPrice = (p: Pickable) => (p.variants ?? []).some((v) => Number(v.price) > 0);

/** Photographed, priced products first, keeping the store's order within each group. */
export function photographedFirst<T extends Pickable>(products: T[]) {
	const score = (p: T) => (hasPhoto(p) ? 0 : 2) + (hasPrice(p) ? 0 : 1);
	return products
		.map((product, index) => ({ product, index }))
		.sort((a, b) => score(a.product) - score(b.product) || a.index - b.index)
		.map(({ product }) => product);
}
