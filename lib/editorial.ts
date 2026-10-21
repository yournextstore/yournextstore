/**
 * Editorial photographs for the hero, the category showcases and the about page: photographs
 * generated for the store, bundled in `public/images/pexels/` (listed in NOTICE.md). Product cards, product
 * pages and the cart keep the store's own product images.
 */
const photo = (name: string) => `/images/pexels/${name}.jpg`;

export const EDITORIAL = {
	hero: [photo("sunglasses-pink"), photo("pink-purse")] as const,
	/** The tall photograph of each category showcase, cycled block by block. */
	showcase: ["pastel-blazer", "summer-accessories", "striped-shirt", "flatlay-espadrilles"].map(photo),
	about: ["glasses-hat", "denim-camera", "pastel-bags", "summer-accessories"].map(photo),
};
