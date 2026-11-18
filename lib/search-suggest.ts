import { try_ } from "safe-try";

export type SearchSuggestion = {
	id: string;
	name: string;
	slug: string;
	image: string | null;
	/** Plain text, at most 120 characters. */
	summary: string | null;
};

/**
 * The search box's suggestions for `query`, or `null` when they could not be fetched.
 *
 * The platform answers them at `/_public/suggest` on this domain (`proxy.ts` forwards `/_public/*`
 * with the store), without a key: a plain GET the browser and the CDN can keep. Never a Server
 * Action, which is a POST nothing caches. Not the results page either: `/search` reads
 * `productBrowse` on the server.
 */
export async function fetchSearchSuggestions(query: string): Promise<SearchSuggestion[] | null> {
	const [error, response] = await try_(fetch(`/_public/suggest?q=${encodeURIComponent(query)}`));
	if (error || !response.ok) return null;
	const [parseError, body] = await try_(response.json() as Promise<{ items?: SearchSuggestion[] }>);
	if (parseError || !Array.isArray(body?.items)) return null;
	return body.items;
}
