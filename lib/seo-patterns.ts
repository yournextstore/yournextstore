const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null;

const textOf = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : undefined);

/** What a pattern's variables stand for on one product page: `{product_name}`, `{category}`, `{store_name}`, `{year}`. */
export type SeoPatternValues = { product_name: string; category: string; store_name: string; year: string };

/** The characters a merchant puts between variables: "{product_name} - {category} | {store_name}". */
const SEPARATOR = "[-–—|·/:,]";
const SEPARATOR_BEFORE_ANOTHER = new RegExp(`(?:\\s*${SEPARATOR})+(?=\\s*${SEPARATOR})`, "g");
const SEPARATORS_AT_THE_ENDS = new RegExp(`^(?:\\s*${SEPARATOR})+\\s*|\\s*(?:${SEPARATOR}\\s*)+$`, "g");

/**
 * A pattern with its variables filled in. A variable with nothing to say (a product without a category) takes
 * the separator next to it along, so "{product_name} - {category} | {store_name}" reads "Candle | NORR", not
 * "Candle - | NORR". A `{name}` that is not a variable stays as written; the admin refuses those when saving.
 */
export function fillSeoPattern(pattern: string, values: SeoPatternValues): string | undefined {
	const known: Record<string, string> = values;
	const filled = pattern
		.replace(/\{([a-z_]+)\}/g, (whole, name: string) => known[name] ?? whole)
		.replace(/\s+/g, " ")
		.replace(SEPARATOR_BEFORE_ANOTHER, "")
		.replace(SEPARATORS_AT_THE_ENDS, "")
		.trim();
	return filled || undefined;
}

/**
 * The title and description a product page takes from the store's patterns, for a product with no SEO title or
 * description of its own. The merchant sets the patterns under Settings → SEO and the Store API returns them as
 * `settings.seoPatterns`; the pinned commerce-kit types don't know the field yet, so it is read by shape.
 * Undefined where the store has no pattern.
 */
export function productSeoFromPatterns(
	settings: unknown,
	values: SeoPatternValues,
): { title?: string; description?: string } {
	const stored = isRecord(settings) ? settings.seoPatterns : undefined;
	if (!isRecord(stored)) {
		return {};
	}
	const title = textOf(stored.productTitle);
	const description = textOf(stored.productDescription);
	return {
		...(title ? { title: fillSeoPattern(title, values) } : {}),
		...(description ? { description: fillSeoPattern(description, values) } : {}),
	};
}
