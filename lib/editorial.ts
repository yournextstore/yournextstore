/**
 * Editorial photography for the home sections and the about page (generated for the store, listed
 * in NOTICE.md). Product cards, product pages and the cart always show the store's own images.
 */
export type EditorialPhoto = { src: string; alt: string };

const photo = (name: string, alt: string): EditorialPhoto => ({ src: `/images/pexels/${name}.jpg`, alt });

export const EDITORIAL = {
	hero: photo(
		"hero-orange-bag",
		"A plain orange coffee pouch beside a cream ceramic dripper, a bowl of roasted beans and mandarins",
	),
	featureLeft: photo("feature-sandals", "Dark roasted coffee beans on a woven bamboo tray in warm sunlight"),
	featureRight: photo(
		"feature-bag-hands",
		"Hands holding a rust-orange cup of black coffee against a cream sweater",
	),
	showcaseLeft: photo(
		"showcase-vase-shapes",
		"A cream ceramic dripper on a glass carafe beside a terracotta jug and coffee leaves",
	),
	showcaseCenter: photo(
		"showcase-pampas",
		"Coffee branches with ripe red cherries in a terracotta jug beside a bowl of green beans",
	),
	showcaseRight: photo(
		"showcase-autumn-flatlay",
		"A coffee pouch, hand grinder, cup of coffee and scattered beans laid out on white",
	),
	faq: photo("faq-vase-shadow", "A glass carafe of brewed coffee and a terracotta cup in afternoon sun"),
	aboutLead: photo(
		"about-jug-flowers",
		"A cup of coffee on a window sill overlooking misty terraced coffee hills",
	),
	aboutDetail: photo(
		"about-rust-outfit",
		"Freshly roasted coffee beans tumbling into a roaster's cooling tray",
	),
} as const;
