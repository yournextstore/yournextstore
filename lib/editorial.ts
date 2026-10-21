/**
 * Editorial photographs (generated for the Clavella demo store, see NOTICE.md) for the pastel
 * banners and the about page. Each banner gets a photograph by what its name suggests, then one
 * from the general pool, never repeating a photograph in the same carousel.
 */
const THEMED: { match: RegExp; image: string }[] = [
	{ match: /keycap|cap|artisan/i, image: "/images/pexels/bags-pastel.jpg" },
	{ match: /keyboard|board|barebone|numpad/i, image: "/images/pexels/folded-shirts.jpg" },
	{ match: /switch/i, image: "/images/pexels/pastel-stationery.jpg" },
	{ match: /desk|mat|cable|wrist|tool|accessor/i, image: "/images/pexels/pastel-still-life.jpg" },
];

const FALLBACK = "/images/pexels/sunglasses-yellow.jpg";
const GENERAL = [FALLBACK, "/images/pexels/pastel-still-life.jpg"];

export const ABOUT_IMAGE = "/images/pexels/about-room.jpg";

export function pickEditorial(names: readonly string[]): string[] {
	const pool = [...GENERAL, ...THEMED.map((theme) => theme.image)];
	const used = new Set<string>();
	return names.map((name) => {
		const image =
			THEMED.find((theme) => theme.match.test(name) && !used.has(theme.image))?.image ??
			pool.find((candidate) => !used.has(candidate)) ??
			FALLBACK;
		used.add(image);
		return image;
	});
}
