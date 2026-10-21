/**
 * Editorial photography bundled with the theme (see NOTICE.md). Product cards, product
 * pages and the bag keep the store's own images; these fill the hero, the listing banners and the
 * category cards, so the look does not depend on what the catalogue was shot like.
 */
export type EditorialImage = { src: string; position?: string };

export const HERO_IMAGE: EditorialImage = { src: "/images/pexels/hero-bags.jpg", position: "50% 45%" };
export const ABOUT_IMAGE: EditorialImage = {
	src: "/images/pexels/about-still-life.jpg",
	position: "50% 60%",
};

const BANNERS: EditorialImage[] = [
	{ src: "/images/pexels/banner-rack.jpg", position: "78% 70%" },
	{ src: "/images/pexels/banner-desk.jpg", position: "50% 45%" },
	{ src: "/images/pexels/banner-knit.jpg", position: "50% 40%" },
];

const TILES: EditorialImage[] = [
	{ src: "/images/pexels/tile-pouch.jpg" },
	{ src: "/images/pexels/tile-hanger.jpg" },
	{ src: "/images/pexels/tile-rack.jpg", position: "35% 50%" },
];

function hash(key: string) {
	let h = 0;
	for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
	return h;
}

/** The all-products banner, then one per listing chosen from its slug so it stays put. */
export function bannerFor(key?: string): EditorialImage {
	if (!key) return BANNERS[0] as EditorialImage;
	return BANNERS[1 + (hash(key) % (BANNERS.length - 1))] as EditorialImage;
}

export function tileFor(index: number): EditorialImage {
	return TILES[index % TILES.length] as EditorialImage;
}
