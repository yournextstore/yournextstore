/**
 * Editorial photographs (generated for the store, see NOTICE.md) for the home's section cards, matched to
 * a section's name where they can be and never repeated on the page.
 */
const THEMED: { match: RegExp; image: string }[] = [
	{ match: /accessor|bag|tote|purse|wallet|jewel/i, image: "/images/pexels/card-woven-bags.jpg" },
	{ match: /apparel|cloth|wear|shirt|hood|fashion|knit|sock/i, image: "/images/pexels/card-socks.jpg" },
	{ match: /digital|book|print|art|stationer|paper|media/i, image: "/images/pexels/card-books.jpg" },
];
const GENERAL = "/images/pexels/card-vases.jpg";

export function pickEditorial(names: readonly string[]): string[] {
	const pool = [GENERAL, ...THEMED.map((theme) => theme.image)];
	const used = new Set<string>();
	return names.map((name) => {
		const image =
			THEMED.find((theme) => theme.match.test(name) && !used.has(theme.image))?.image ??
			pool.find((candidate) => !used.has(candidate)) ??
			GENERAL;
		used.add(image);
		return image;
	});
}

type ProductLike = { images: string[]; variants: { price: string }[] };

const rank = (product: ProductLike) =>
	(product.images.length > 0 ? 0 : 2) +
	(product.variants.some((variant) => Number(variant.price) > 0) ? 0 : 1);

/** Photographed, priced products first: a card without a picture or price never leads a row. */
export function photographedFirst<T extends ProductLike>(products: readonly T[]): T[] {
	return products
		.map((product, index) => ({ product, index }))
		.sort((a, b) => rank(a.product) - rank(b.product) || a.index - b.index)
		.map(({ product }) => product);
}
