/**
 * Editorial photographs (generated for the store, listed in NOTICE.md) for the hero slides and category tiles.
 * A category's own image always wins; otherwise one is picked by what its name suggests, then
 * from the general pool, without repeating a photograph on the same page.
 */
type Themed = { match: RegExp; hero: string; tile: string };

const THEMED: Themed[] = [
	{
		match: /accessor|bag|tote|jewel|glass|belt|shoe|footwear|wallet/i,
		hero: "/images/pexels/hero-bag-stool.jpg",
		tile: "/images/pexels/tile-sandals-bag.jpg",
	},
	{
		match: /apparel|cloth|wear|shirt|fashion|hood|trouser|dress|knit/i,
		hero: "/images/pexels/hero-outfit.jpg",
		tile: "/images/pexels/tile-clothes-rack.jpg",
	},
	{
		match: /digital|book|print|art|media|music|download|stationer|desk|office/i,
		hero: "/images/pexels/hero-headphones-books.jpg",
		tile: "/images/pexels/tile-desk.jpg",
	},
];

const GENERAL = {
	hero: ["/images/pexels/hero-sunglasses-book.jpg", "/images/pexels/hero-beige-flatlay.jpg"],
	tile: ["/images/pexels/tile-shirt-sunglasses.jpg"],
};

export const ALL_PRODUCTS_TILE_IMAGE = "/images/pexels/tile-shirt-sunglasses.jpg";
export const ABOUT_IMAGE = "/images/pexels/about-hangers.jpg";

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
		return (
			take(themed?.[kind]) ??
			take(pool.find((image) => !used.has(image))) ??
			pool[0] ??
			ALL_PRODUCTS_TILE_IMAGE
		);
	});
}
