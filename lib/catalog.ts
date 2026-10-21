import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";

export type HeroSlide = {
	id: string;
	title: string;
	image: string;
	href: string;
};

/**
 * Editorial photographs (credited in NOTICE.md), subject on the right so the giant
 * title keeps the left. Picked by what a section's name suggests, never repeated.
 */
const THEMED: { match: RegExp; image: string }[] = [
	{ match: /desk|charg|power|stand|cable/i, image: "/images/pexels/hero-rack.jpg" },
	{ match: /travel|carry|bag|pouch|sleeve|organi[sz]/i, image: "/images/pexels/hero-bags.jpg" },
];
const GENERAL = "/images/pexels/hero-hook.jpg";

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

/** One slide per shop section: the store's top categories, then its filled collections. */
export async function getHeroSlides(): Promise<HeroSlide[]> {
	"use cache";
	cacheLife("hours");
	const [categories, collections] = await Promise.all([
		commerce.categoriesBrowse({ active: true, limit: 12 }).catch(() => ({ data: [] })),
		commerce.collectionBrowse({ limit: 12 }).catch(() => ({ data: [] })),
	]);
	// A manual collection without members would land the shopper on an empty grid.
	const sections = [
		...collections.data
			.filter((c) => (c.productCollections?.length ?? 0) > 0 || (c.metafieldRules?.length ?? 0) > 0)
			.map((c) => ({ id: c.id, title: c.name, href: `/collection/${c.slug}` })),
		...categories.data
			.filter((category) => !category.parentId)
			.map((category) => ({ id: category.id, title: category.name, href: `/category/${category.slug}` })),
	].slice(0, 3);
	const slides = sections.length > 0 ? sections : [{ id: "all", title: "Shop all", href: "/products" }];
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

/** One browse for every home shelf; shelves are cut from it in memory. */
export async function getShelfProducts() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({ active: true, limit: 100 });
	return data;
}
