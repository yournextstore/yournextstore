/**
 * Editorial photography for the slots Blueprint fills with campaign shoots from its CMS (hero
 * triptych, half heroes, feature hero, tiles, About). AI-generated photos made for
 * the demo store (see NOTICE.md); product cards, product pages and the cart keep the store's own
 * product images. Plain public paths rather than static imports (see PLAYBOOK, 030 rework).
 */
export type Photo = { src: string; alt: string; position?: string };

const photo = (name: string, alt = "", position?: string): Photo => ({
	src: `/images/pexels/${name}.jpg`,
	alt,
	position,
});

export const editorial = {
	hero: [photo("hero-blue-vest"), photo("hero-orange-studio"), photo("hero-yellow-wall")],
	wear: photo(
		"wear-sun-hat",
		"Woman in a pale blue sun hoodie and tan trail shorts walking a gravel path through tall grass",
		"50% 30%",
	),
	feature: [photo("feature-sidewalk", "", "50% 40%"), photo("feature-sunny-street", "", "50% 40%")],
	newProducts: photo(
		"new-colour-wall",
		"Man in a green grid fleece leaning on a wooden fence at a trailhead",
		"50% 30%",
	),
	tiles: [
		photo("tile-skate-crew", "Four friends walking up a grassy hill path"),
		photo(
			"tile-flat-lay",
			"Green merino tee, trail cap, hiking socks and steel bottles laid out on a granite boulder",
		),
	],
	aboutBand: [photo("about-grey-hoodie"), photo("about-yellow-blazer"), photo("about-denim-group")],
	aboutHalf: photo(
		"about-pink-hoodie",
		"Woman in a cream fleece jacket sitting on a grassy ridge at sunset",
		"50% 40%",
	),
};
