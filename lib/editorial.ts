// Editorial photographs (generated for this store, see NOTICE.md) for the faceplates on the about page
// and collection headers. Product cards and pages keep the store's own photos.

export const ABOUT_PHOTO = "/images/pexels/patch-cables.jpg";

const SHELF_PHOTOS = ["/images/pexels/brogues-watch.jpg", "/images/pexels/wallet-sunglasses.jpg"] as const;

/** A stable photograph per collection, so each shelf keeps its own picture without hardcoding slugs. */
export function shelfPhoto(slug: string): string {
	let hash = 0;
	for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) % 9973;
	return SHELF_PHOTOS[hash % SHELF_PHOTOS.length] ?? SHELF_PHOTOS[0];
}

/** A manual collection without members (or rules) opens an empty page, so links skip it. */
export const hasMembers = (c: { productCollections?: unknown[] | null; metafieldRules?: unknown[] | null }) =>
	(c.productCollections?.length ?? 0) > 0 || (c.metafieldRules?.length ?? 0) > 0;
