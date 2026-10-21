/**
 * Editorial photographs (see NOTICE.md) for the hero slides, category tiles and
 * the about page. A category's own image always wins; otherwise one is picked by what its name
 * suggests, then from the general pool, without repeating a photograph in the same list.
 */
type Themed = { match: RegExp; hero: string; tile: string };

const THEMED: Themed[] = [
	{
		match: /bear|teddy|cub/i,
		hero: "/images/pexels/hero-knit-glasses.jpg",
		tile: "/images/pexels/tile-rack-hat.jpg",
	},
	{
		match: /wood|fox|forest|owl|deer|hedgehog/i,
		hero: "/images/pexels/hero-rack-pampas.jpg",
		tile: "/images/pexels/tile-bag-cafe.jpg",
	},
	{
		match: /bunn|rabbit|hare/i,
		hero: "/images/pexels/hero-still-life.jpg",
		tile: "/images/pexels/tile-vases-books.jpg",
	},
];

const GENERAL = {
	hero: ["/images/pexels/hero-still-life.jpg", "/images/pexels/hero-knit-glasses.jpg"],
	tile: ["/images/pexels/tile-books-frame.jpg"],
};

export const HERO_FALLBACK_IMAGES = [
	"/images/pexels/hero-still-life.jpg",
	"/images/pexels/hero-knit-glasses.jpg",
	"/images/pexels/hero-rack-pampas.jpg",
];
export const ABOUT_IMAGE = "/images/pexels/about-linen.jpg";

/** One photograph per name, in order, matched by theme first and never reused within the list. */
export function pickEditorial(names: readonly string[], kind: "hero" | "tile"): string[] {
	const pool = [...THEMED.map((theme) => theme[kind]), ...GENERAL[kind]];
	const used = new Set<string>();
	const take = (image: string | undefined) => {
		if (image) used.add(image);
		return image;
	};
	return names.map((name) => {
		const themed = THEMED.find((theme) => theme.match.test(name) && !used.has(theme[kind]));
		return take(themed?.[kind]) ?? take(pool.find((image) => !used.has(image))) ?? pool[0] ?? ABOUT_IMAGE;
	});
}
