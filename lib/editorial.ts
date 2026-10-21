/**
 * Editorial photography for the home banner, the about page and listing covers (generated for
 * this template's store, listed in NOTICE.md). Product cards, product pages and the cart always show the
 * store's own product images.
 */
export type EditorialPhoto = { src: string; alt: string };

const photo = (name: string, alt: string): EditorialPhoto => ({ src: `/images/pexels/${name}.jpg`, alt });

export const EDITORIAL = {
	hero: photo(
		"hero-pampas-vases",
		"A lit candle and a reed diffuser on an oak bench beside a vase of ferns against a sand wall",
	),
	about: photo(
		"about-peach-room",
		"Rows of freshly poured candles cooling on an oak table in a sunlit peach workroom",
	),
	/** Covers for collections and categories that have no image of their own. */
	covers: [
		photo("cover-dried-palm", "A frosted glass candle beside a fern in a sand-coloured vase in warm light"),
		photo("cover-dried-flowers", "A lit candle in blush glass beside a fern and dried grass on a beige wall"),
		photo("cover-vase-linen", "A cream ceramic candle bowl with a fern sprig on draped linen"),
		photo("cover-amber-bottles", "Two amber glass reed diffusers with black reeds on a peach cloth"),
	],
} as const;
