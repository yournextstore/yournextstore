/**
 * Editorial photographs bundled with the theme (made for this store; see NOTICE.md).
 * Hero plates, the mega menu and the house page use these; product records always show the
 * store's own photographs.
 */
export type Plate = { src: string; alt: string };

export const HOME_PLATES: Plate[] = [
	{ src: "/images/pexels/backpack-light.jpg", alt: "Steel wristwatch on a writing desk in late light" },
	{ src: "/images/pexels/boots-belt-purse.jpg", alt: "Velvet tray of gold rings, a chain and hoop earrings" },
	{ src: "/images/pexels/sunglasses-fern.jpg", alt: "Gold ring on a pressed fern in an old book" },
];

export const REGISTER_PLATES: Plate[] = [
	{ src: "/images/pexels/briefcase.jpg", alt: "Mechanical wristwatch on a sheet of paper" },
	{ src: "/images/pexels/open-bag.jpg", alt: "Watchmaker's bench with an open movement and dial sketches" },
	{ src: "/images/pexels/glasses-pages.jpg", alt: "Gold chain with a pearl pendant on old book pages" },
];

export const MEGA_PLATE: Plate = {
	src: "/images/pexels/card-catalog.jpg",
	alt: "Open card-catalogue drawer with a gold ring",
};

export const HOUSE_PLATES: Plate[] = [
	{ src: "/images/pexels/watch-books.jpg", alt: "Gold pocket watch on a stack of old books" },
	{ src: "/images/pexels/suitcase-books.jpg", alt: "Velvet-lined jewellery box beside old books" },
];

/** Bundled photographs are served by next/image directly; store media goes through YNSMedia. */
export function isBundled(src: string) {
	return src.startsWith("/images/");
}
