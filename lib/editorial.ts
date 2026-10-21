/**
 * Editorial photography bundled with the theme (see NOTICE.md). Product cards, product
 * pages and the cart keep the store's own images; these fill the banner prints, the closing cards
 * and a collection header without its own picture.
 */
export const BANNER_PRINTS = [
	"/images/pexels/print-hat-hooks.jpg",
	"/images/pexels/print-straw-bag.jpg",
	"/images/pexels/print-sunglasses.jpg",
];

export const CARD_IMAGES = [
	"/images/pexels/card-handbag-stool.jpg",
	"/images/pexels/card-cup-sofa.jpg",
	"/images/pexels/card-vase-shelf.jpg",
];

export const COLLECTION_FALLBACK = "/images/pexels/banner-roses.jpg";

/** A manual collection without members opens an empty page, so it is never linked. */
export function hasMembers(c: { productCollections?: unknown[] | null; metafieldRules?: unknown[] | null }) {
	return (c.productCollections?.length ?? 0) > 0 || (c.metafieldRules?.length ?? 0) > 0;
}
