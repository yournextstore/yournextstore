/**
 * Editorial photography for the slots the original filled with model shoots (hero, feature band,
 * lookbook, newsletter, split panels, banners, About). Free stock photos from Pexels (Pexels
 * License), credited in NOTICE.md; product cards, product pages and the cart keep the store's own
 * product images.
 */
// Plain public paths, not static imports: on Vercel the Turbopack build referenced hashed
// `/_next/static/media/*` files that were never served (404), so every editorial slot was blank.
export type EditorialPhoto = { src: string; alt: string; position?: string };

export const editorial = {
	hero: {
		src: "/images/pexels/hero-trench-walk.jpg",
		alt: "Woman in a trench coat walking past a sunlit wall",
		position: "50% 40%",
	},
	feature: {
		src: "/images/pexels/feature-rack.jpg",
		alt: "Garments on a metal rail in a bright, quiet room",
	},
	lookbook: [
		{ src: "/images/pexels/lookbook-tote.jpg", alt: "Woman walking through the city with a shoulder bag" },
		{ src: "/images/pexels/lookbook-straw-hat.jpg", alt: "Woman in a straw hat and linen shirt" },
		{ src: "/images/pexels/lookbook-flat-lay.jpg", alt: "Beige shoes and a handbag laid out on white linen" },
	],
	newsletter: { src: "/images/pexels/newsletter-leather-backpack.jpg", alt: "" },
	panels: [
		{ src: "/images/pexels/panel-trench-marble.jpg", alt: "", position: "50% 30%" },
		{ src: "/images/pexels/panel-handbag.jpg", alt: "", position: "40% 50%" },
	],
	allProductsTile: { src: "/images/pexels/tile-boutique.jpg", alt: "" },
	listingBanner: { src: "/images/pexels/banner-fabrics.jpg", alt: "" },
	groupBanner: { src: "/images/pexels/banner-knit-flat-lay.jpg", alt: "" },
	aboutHero: { src: "/images/pexels/about-blazer.jpg", alt: "" },
	aboutStory: {
		src: "/images/pexels/about-knit-rack.jpg",
		alt: "Knitwear on a clothes rail beside dried palm leaves",
	},
} satisfies Record<string, EditorialPhoto | EditorialPhoto[]>;
