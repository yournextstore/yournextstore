/**
 * Editorial photographs (generated, listed in NOTICE.md) for the hero slides, the collection tiles and
 * the about page. A slot is matched by what its collection or category name suggests, then filled
 * from the general pool, never repeating a photograph within one list.
 */
type Themed = { match: RegExp; hero: string; tile: string };

const THEMED: Themed[] = [
	{
		match: /pendant|over the table|dining|ceiling/i,
		hero: "/images/pexels/hero-mesh-bag.jpg",
		tile: "/images/pexels/tile-rack.jpg",
	},
	{
		match: /reading|desk|study/i,
		hero: "/images/pexels/hero-tote.jpg",
		tile: "/images/pexels/tile-headphones-books.jpg",
	},
	{
		match: /natural|material|floor|paper/i,
		hero: "/images/pexels/hero-rack.jpg",
		tile: "/images/pexels/tile-blazer.jpg",
	},
	{
		match: /table lamp|bedside|side lamp/i,
		hero: "/images/pexels/hero-rack.jpg",
		tile: "/images/pexels/tile-still-life.jpg",
	},
];

const GENERAL = {
	hero: ["/images/pexels/hero-tote.jpg", "/images/pexels/hero-mesh-bag.jpg", "/images/pexels/hero-rack.jpg"],
	tile: [
		"/images/pexels/tile-still-life.jpg",
		"/images/pexels/tile-bag-shoes.jpg",
		"/images/pexels/hero-mesh-bag.jpg",
		"/images/pexels/about-books.jpg",
	],
};

export const ALL_PRODUCTS_TILE_IMAGE = "/images/pexels/tile-bag-shoes.jpg";
export const ABOUT_IMAGES = ["/images/pexels/about-desk.jpg", "/images/pexels/about-books.jpg"];

/** One photograph per name, in order: a themed match first, then the general pool. */
export function pickEditorial(
	names: readonly string[],
	kind: "hero" | "tile",
	taken: string[] = [],
): string[] {
	const pool = [...GENERAL[kind], ...THEMED.map((theme) => theme[kind])];
	const used = new Set<string>(taken);
	const take = (image: string | undefined) => {
		if (image) used.add(image);
		return image;
	};
	return names.map((name) => {
		const themed = THEMED.find((theme) => theme.match.test(name) && !used.has(theme[kind]));
		return take(themed?.[kind]) ?? take(pool.find((image) => !used.has(image))) ?? pool[0] ?? "";
	});
}
