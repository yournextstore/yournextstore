/**
 * Bundled editorial photos (Pexels, credited in NOTICE.md) for the hero, collection and banner
 * slots. Product cards, product pages and the cart keep the store's own images.
 */
export const heroPhoto = "/images/pexels/hero-studio.jpg";
export const bannerPhoto = "/images/pexels/sage-flatlay.jpg";
export const aboutPhoto = "/images/pexels/olive-still-life.jpg";

const pool = [
	"/images/pexels/rack-neutrals.jpg",
	"/images/pexels/green-desk.jpg",
	"/images/pexels/knit-and-leather.jpg",
	"/images/pexels/olive-still-life.jpg",
];

/** A stable photo per position, so a collection keeps its picture across the header, home and listing. */
export const editorialPhoto = (index: number) => pool[index % pool.length] ?? heroPhoto;
