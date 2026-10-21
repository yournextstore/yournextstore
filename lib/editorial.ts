/**
 * Editorial photographs for the hero, promo bands, feature grid and about page: Pexels and generated
 * photos bundled in `public/images/pexels/` (credited in NOTICE.md). Product cards, product
 * pages and the cart keep the store's own product images.
 */
const photo = (name: string) => `/images/pexels/${name}.jpg`;

export const EDITORIAL = {
	hero: ["rack-neutral", "shirts-rack", "jackets-rail"].map(photo),
	collection: ["white-sneakers", "yellow-bag", "white-bags"].map(photo),
	features: ["rack-wide", "flat-lay", "sunglasses-book"].map(photo),
	members: photo("boutique-rail"),
	aboutBand: ["closet", "rack-plant", "linen-closet"].map(photo),
	aboutStory: ["sunglasses-pool", "sunglasses-water", "sweater-hanger"].map(photo),
};
