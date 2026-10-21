import { cacheLife } from "next/cache";
import { try_ } from "safe-try";
import { commerce, meGetCached } from "@/lib/commerce";

export type ShopLink = { href: string; label: string };

export type ShopInfo = {
	storeName: string;
	description: string | null;
	contactForm: boolean;
	blog: boolean;
	socials: ShopLink[];
};

const SOCIAL_LABELS = {
	instagram: "Instagram",
	facebook: "Facebook",
	x: "X",
	youtube: "YouTube",
	tiktok: "TikTok",
	linkedin: "LinkedIn",
} as const;

/** Store identity and the switches the chrome reads (cached, so header and footer stay in the shell). */
export async function getShopInfo(): Promise<ShopInfo> {
	"use cache";
	cacheLife("hours");
	const [meError, me] = await try_(meGetCached());
	const [socialError, socials] = await try_(commerce.socialsGet());
	const settings = meError ? null : me.store.settings;
	const storeName = settings?.storeName || (meError ? "" : me.store.name) || "Our Store";
	const links = socialError
		? []
		: Object.entries(SOCIAL_LABELS).flatMap(([key, label]) => {
				const url = socials.socials[key as keyof typeof SOCIAL_LABELS];
				return url ? [{ href: url, label }] : [];
			});
	return {
		storeName,
		description: settings?.storeDescription || null,
		contactForm: settings?.enabledTools?.contactForm ?? false,
		blog: settings?.enabledTools?.blog ?? false,
		socials: links,
	};
}

export type HeroSlide = {
	title: string;
	href: string;
	image: string;
	cta: string;
};

/**
 * Editorial still lifes on pale walls (store photography, see NOTICE.md), matched to a section's
 * name where they can be and never repeated within the carousel.
 */
const THEMED: { match: RegExp; image: string }[] = [
	{ match: /apparel|cloth|wear|shirt|hood|fashion|knit|dress/i, image: "/images/pexels/hero-shirts.jpg" },
	{ match: /accessor|bag|tote|purse|wallet|jewel|shoe/i, image: "/images/pexels/hero-bag-stool.jpg" },
];
const GENERAL = "/images/pexels/hero-shelf.jpg";
export const ABOUT_IMAGE = "/images/pexels/about-chair.jpg";

function pickEditorial(names: readonly string[]) {
	const pool = [GENERAL, ...THEMED.map((theme) => theme.image)];
	const used = new Set<string>();
	return names.map((name) => {
		const image =
			THEMED.find((theme) => theme.match.test(name) && !used.has(theme.image))?.image ??
			pool.find((candidate) => !used.has(candidate)) ??
			GENERAL;
		used.add(image);
		return image;
	});
}

/**
 * The carousel's three slides: the store's filled collections, then its top categories, each
 * over an editorial still life and linking to the section it names.
 */
export async function getHeroSlides(): Promise<HeroSlide[]> {
	"use cache";
	cacheLife("hours");
	const [colError, collections] = await try_(commerce.collectionBrowse({ limit: 100 }));
	const [catError, categories] = await try_(commerce.categoriesBrowse({ active: true, limit: 50 }));
	// A manual collection without members would open an empty page.
	const sections = [
		...(colError ? [] : collections.data)
			.filter((c) => (c.productCollections?.length ?? 0) > 0 || (c.metafieldRules?.length ?? 0) > 0)
			.map((c) => ({ title: c.name, href: `/collection/${c.slug}`, cta: "view collection" })),
		...(catError ? [] : categories.data)
			.filter((category) => !category.parentId)
			.map((category) => ({ title: category.name, href: `/category/${category.slug}`, cta: "shop now" })),
	].slice(0, 3);
	const slides = sections.length > 0 ? sections : [{ title: "The shop", href: "/products", cta: "shop now" }];
	const images = pickEditorial(slides.map((slide) => slide.title));
	return slides.map((slide, index) => ({ ...slide, image: images[index] ?? GENERAL }));
}

type ProductLike = { images: string[]; variants: { price: string }[] };

const rank = (product: ProductLike) =>
	(product.images.length > 0 ? 0 : 2) +
	(product.variants.some((variant) => Number(variant.price) > 0) ? 0 : 1);

/** Photographed, priced products first: a card without a picture or price never leads a row. */
export function photographedFirst<T extends ProductLike>(products: readonly T[]): T[] {
	return products
		.map((product, index) => ({ product, index }))
		.sort((a, b) => rank(a.product) - rank(b.product) || a.index - b.index)
		.map(({ product }) => product);
}
