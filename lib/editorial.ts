/**
 * The theme's editorial photographs (generated for the demo store, see NOTICE.md). Product cards, product pages
 * and the cart keep the store's own images; these fill the mood slots around them.
 */
export const HERO_IMAGES = [
	"/images/pexels/hero-leather-bag.jpg",
	"/images/pexels/hero-brogues.jpg",
	"/images/pexels/hero-boutique.jpg",
] as const;

export const STORY_IMAGES = {
	main: "/images/pexels/story-black-bag.jpg",
	inset: "/images/pexels/story-sunglasses.jpg",
} as const;

export const QUOTE_IMAGE = "/images/pexels/quote-sunglasses.jpg";
export const BANNER_IMAGE = "/images/pexels/banner-boutique.jpg";
export const FOOTER_IMAGE = "/images/pexels/hero-boutique.jpg";

export const CARD_IMAGES = [
	"/images/pexels/card-autumn-bag.jpg",
	"/images/pexels/card-sunglasses-log.jpg",
	"/images/pexels/card-bag-glove.jpg",
] as const;

/** Bundled photographs go through next/image directly; store URLs through YNSMedia. */
export const isBundled = (src: string) => src.startsWith("/");
