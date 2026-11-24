import { try_ } from "safe-try";
import type { PricedVariant } from "@/lib/pricing";

export type SearchSuggestion = {
	id: string;
	name: string;
	slug: string;
	image: string | null;
	/** Plain text, at most 120 characters. */
	summary: string | null;
	/** The variants' price fields, for the listing price; empty when the platform sent none. */
	variants: PricedVariant[];
};

export type SuggestedCategory = { id: string; name: string; slug: string; path: string[] };
export type SuggestedBrand = { id: string; name: string; slug: string };

export type SearchSuggestions = {
	products: SearchSuggestion[];
	/** What other shoppers searched: completions while typing, the most searched in an empty box. */
	queries: string[];
	categories: SuggestedCategory[];
	brands: SuggestedBrand[];
};

const PRICE_FIELDS = (
	["price", "originalPrice", "calculatedPrice", "prePromotionPrice", "omnibusPrice"] as const
).flatMap((field) => [field, `${field}Gross` as const]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null;
const text = (value: unknown) => (typeof value === "string" ? value : null);

const productOf = (value: unknown): SearchSuggestion[] => {
	if (!isRecord(value)) return [];
	const id = text(value.id);
	const name = text(value.name);
	const slug = text(value.slug);
	if (!id || !name || !slug) return [];
	const variants = Array.isArray(value.variants)
		? value.variants.flatMap((variant): PricedVariant[] =>
				isRecord(variant) && typeof variant.price === "string"
					? [
							{
								...Object.fromEntries(
									PRICE_FIELDS.flatMap((field) => {
										const price = variant[field];
										return typeof price === "string" || price === null ? [[field, price]] : [];
									}),
								),
								price: variant.price,
							},
						]
					: [],
			)
		: [];
	return [{ id, name, slug, image: text(value.image), summary: text(value.summary), variants }];
};

const entityOf = (value: unknown) => {
	if (!isRecord(value)) return null;
	const id = text(value.id);
	const name = text(value.name);
	const slug = text(value.slug);
	return id && name && slug ? { id, name, slug, path: value.path } : null;
};

const listOf = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

/**
 * The search box's suggestions for `query` (an empty query: what to show before typing), or `null`
 * when they could not be fetched.
 *
 * The platform answers them at `/_public/suggest` on this domain (`proxy.ts` forwards `/_public/*`
 * with the store), without a key: a plain GET the browser and the CDN can keep. Never a Server
 * Action, which is a POST nothing caches. Not the results page either: `/search` reads
 * `productBrowse` on the server. A platform that predates queries, categories, brands or prices
 * leaves them out, and the box shows the products alone.
 */
export async function fetchSearchSuggestions(query: string): Promise<SearchSuggestions | null> {
	const params = new URLSearchParams({ q: query, include: "queries,categories,brands,price" });
	const [error, response] = await try_(fetch(`/_public/suggest?${params}`));
	if (error || !response.ok) return null;
	const [parseError, body] = await try_(response.json() as Promise<unknown>);
	if (parseError || !isRecord(body) || !Array.isArray(body.items)) return null;
	return {
		products: body.items.flatMap(productOf),
		queries: listOf(body.queries).flatMap((entry) => (typeof entry === "string" && entry ? [entry] : [])),
		categories: listOf(body.categories).flatMap((entry) => {
			const category = entityOf(entry);
			if (!category) return [];
			const path = listOf(category.path).filter((slug): slug is string => typeof slug === "string");
			return [
				{
					id: category.id,
					name: category.name,
					slug: category.slug,
					path: path.length ? path : [category.slug],
				},
			];
		}),
		brands: listOf(body.brands).flatMap((entry) => {
			const brand = entityOf(entry);
			return brand ? [{ id: brand.id, name: brand.name, slug: brand.slug }] : [];
		}),
	};
}
