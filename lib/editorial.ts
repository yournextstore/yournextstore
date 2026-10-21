// Editorial photographs (generated for this store): hero, about, the six-step stepper,
// shelf tabs and collection banners. Product cards and pages keep the store's own photos.

export type Photo = { src: string; alt: string };

export const HERO_PHOTO: Photo = {
	src: "/images/pexels/copper-spiral.jpg",
	alt: "A brushed steel espresso machine with a pressure gauge, its edge falling into shadow.",
};

export const ABOUT_BANNER: Photo = {
	src: "/images/pexels/leather-desk.jpg",
	alt: "A dark café workbench with an espresso machine, a grinder and small cups under one pendant lamp.",
};

export const ABOUT_INLINE: Photo = {
	src: "/images/pexels/watch-pendant.jpg",
	alt: "Hands adjusting the pressure valve inside an opened espresso machine.",
};

const SHELF_PHOTOS: { match: RegExp; photo: Photo }[] = [
	{
		match: /tool|tamp|portafilter|basket|prep|access/i,
		photo: {
			src: "/images/pexels/leather-wallet.jpg",
			alt: "A tamper, a distribution tool and a portafilter on a dark leather mat.",
		},
	},
	{
		match: /cup|pitcher|glass|milk|gift/i,
		photo: {
			src: "/images/pexels/clothes-rack.jpg",
			alt: "Steel milk pitchers and espresso glasses on a dark wooden shelf.",
		},
	},
	{
		match: /grind|burr|bean/i,
		photo: {
			src: "/images/pexels/vinyl-disc.jpg",
			alt: "Roasted beans in a grinder hopper above the steel burr.",
		},
	},
];

const SHELF_FALLBACK: Photo[] = [
	{
		src: "/images/pexels/leather-purse.jpg",
		alt: "A glass of espresso with thick crema on a dark stone counter.",
	},
	{ src: "/images/pexels/brass-rings.jpg", alt: "A round espresso pressure gauge with a copper needle." },
	{
		src: "/images/pexels/leather-jacket-watch.jpg",
		alt: "A brushed steel and a matte black espresso machine side by side.",
	},
];

/** A photograph for a shelf (category or collection) by its name, with a stable fallback per name. */
export function shelfPhoto(name: string): Photo {
	const hit = SHELF_PHOTOS.find((entry) => entry.match.test(name));
	if (hit) return hit.photo;
	let hash = 0;
	for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) % 9973;
	return SHELF_FALLBACK[hash % SHELF_FALLBACK.length] ?? HERO_PHOTO;
}

/** A manual collection without members (or rules) opens an empty page, so links skip it. */
export const hasMembers = (c: { productCollections?: unknown[] | null; metafieldRules?: unknown[] | null }) =>
	(c.productCollections?.length ?? 0) > 0 || (c.metafieldRules?.length ?? 0) > 0;
