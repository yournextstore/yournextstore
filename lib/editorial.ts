/**
 * Editorial photography for the slideshow, banners, lookbook, about page and listing covers
 * (free Pexels photos, credited in NOTICE.md). Product cards, product pages and the cart always
 * show the store's own product images.
 */
export type EditorialPhoto = { src: string; alt: string };

const photo = (name: string, alt: string): EditorialPhoto => ({ src: `/images/pexels/${name}.jpg`, alt });

export const EDITORIAL = {
	slides: [
		photo("slide-hills", "Two people in light linen layers standing on a grassy hilltop"),
		photo("slide-coast", "A person in a long trench coat on a coastal path at sunset"),
		photo("slide-street", "A person in a trench coat walking along a sunny city street"),
	],
	story: photo("story-shore", "Three people in long coats standing on a sandy shore"),
	look: photo("look-flatlay", "A knit cardigan, headphones and a leather bag laid out on linen"),
	gallery: [
		photo("gallery-jacket", "A suede jacket, leather belt and watch lying in sunlight"),
		photo("gallery-bags", "Three leather tote bags laid out on a cream sheet"),
		photo("gallery-table", "A leather satchel and sunglasses on a weathered wooden table"),
		photo("gallery-sneakers", "Suede sneakers on dark pavement scattered with autumn leaves"),
	],
	aboutHero: photo("about-boutique", "The interior of a clothing boutique with full rails"),
	aboutStory: photo("about-rack", "Knitted cardigans on a rail beside a vase of dried palm leaves"),
	/** Covers for collections and categories that have no image of their own. */
	listings: [
		photo("tile-rack", "A clothes rail with a hat, knitwear and dried grasses"),
		photo("tile-trench", "A trench coat hanging on a rail in a bright room"),
		photo("tile-travel", "Leather bags and a hat on an unmade bed"),
	],
} as const;

/** A stable listing cover for a collection or category without its own image. */
export function listingCover(key: string): EditorialPhoto {
	const hash = Array.from(key).reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0, 7);
	return EDITORIAL.listings[hash % EDITORIAL.listings.length] ?? EDITORIAL.listings[0];
}
