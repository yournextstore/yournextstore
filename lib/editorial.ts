/**
 * Editorial images bundled with the theme (see NOTICE.md). Product cards, product
 * pages and the cart keep the store's own images; these fill the hero cover, the photo band and
 * the about page, so the look does not depend on how the catalogue was shot.
 */
export type EditorialImage = { src: string; alt: string };

export const HERO_COVER: EditorialImage = {
	src: "/images/pexels/cover-pastel.jpg",
	alt: "",
};

export const MOSAIC: EditorialImage[] = [
	{
		src: "/images/pexels/shelf-desk.jpg",
		alt: "A desk lamp, a plant and a stack of books by a bookshop window",
	},
	{ src: "/images/pexels/shelf-bag-rail.jpg", alt: "A canvas tote of books hanging from a wall hook" },
	{ src: "/images/pexels/shelf-mint.jpg", alt: "Books standing face out on a light oak shelf" },
	{
		src: "/images/pexels/shelf-coat-rack.jpg",
		alt: "A mint armchair and a side table with an open book and tea",
	},
	{ src: "/images/pexels/shelf-mirror.jpg", alt: "An open book with a leather bookmark on linen" },
];

export const ABOUT_BANNER: EditorialImage = { src: "/images/pexels/about-banner.jpg", alt: "" };

export const ABOUT_FRAMED: EditorialImage = {
	src: "/images/pexels/about-tote.jpg",
	alt: "A cup of tea and an open book on a sunlit window seat",
};
