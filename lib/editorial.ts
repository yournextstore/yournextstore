/**
 * Editorial photographs (credited in NOTICE.md) for the hero, the banners, the category
 * tiles and the about page. A slot is matched by what its category or collection name suggests,
 * then filled from the general pool, never repeating a photograph within one list.
 */
export const HERO_IMAGE = "/images/pexels/hero-desk-things.jpg";
export const BANNER_IMAGE = "/images/pexels/banner-suitcase.jpg";
export const ABOUT_IMAGE = "/images/pexels/about-flatlay.jpg";

const THEMED: { match: RegExp; image: string }[] = [
	{ match: /coffee|bean|blend|origin/i, image: "/images/pexels/tile-black-fabric.jpg" },
	{ match: /capsule|pod|espresso/i, image: "/images/pexels/tile-leather-bag.jpg" },
	{ match: /night|dark|evening/i, image: "/images/pexels/tile-headphones.jpg" },
	{ match: /espresso|roast/i, image: "/images/pexels/tile-croc-bag.jpg" },
	{ match: /device|gear|grinder|brew|equipment/i, image: "/images/pexels/tile-mens-things.jpg" },
	{ match: /cup|mug|gift|merch/i, image: "/images/pexels/tile-sunglasses-dark.jpg" },
];

const GENERAL = [
	"/images/pexels/tile-leather-bag.jpg",
	"/images/pexels/tile-sunglasses-dark.jpg",
	"/images/pexels/tile-black-fabric.jpg",
	"/images/pexels/tile-mens-things.jpg",
];

/** The photograph a single name suggests (listing banners), else the general banner. */
export function editorialFor(name: string): string {
	return THEMED.find((theme) => theme.match.test(name))?.image ?? BANNER_IMAGE;
}

/** One photograph per name, in order: a themed match first, then the general pool. */
export function pickEditorial(names: readonly string[]): string[] {
	const pool = [...GENERAL, ...THEMED.map((theme) => theme.image)];
	const used = new Set<string>();
	return names.map((name) => {
		const image =
			THEMED.find((theme) => theme.match.test(name) && !used.has(theme.image))?.image ??
			pool.find((candidate) => !used.has(candidate)) ??
			GENERAL[0] ??
			BANNER_IMAGE;
		used.add(image);
		return image;
	});
}
