// Editorial photographs (generated for the store, see NOTICE.md) for the notebook spreads: the hero,
// the about page and collection headers. Product cards and pages keep the store's own photos.

export const HERO_PHOTO = "/images/pexels/mesh-bag-notepads.jpg";
export const ABOUT_PHOTO = "/images/pexels/kraft-notebooks.jpg";

const SHELF_PHOTOS = [
	"/images/pexels/cotton-sack-sunglasses.jpg",
	"/images/pexels/glasses-clipboard.jpg",
	"/images/pexels/mesh-bag-notepads.jpg",
] as const;

/** A stable photograph per collection, so each shelf keeps its own picture without hardcoding slugs. */
export function shelfPhoto(slug: string): string {
	let hash = 0;
	for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) % 9973;
	return SHELF_PHOTOS[hash % SHELF_PHOTOS.length] ?? SHELF_PHOTOS[0];
}
