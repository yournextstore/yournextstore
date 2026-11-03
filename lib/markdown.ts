/**
 * The storefront pages that also answer in Markdown, for AI agents. An agent asks for Markdown with
 * `Accept: text/markdown` (or `text/plain`) or by adding `.md` to the address; the proxy then
 * rewrites the request to the platform's `/<subdomain>/md/…` route for that page.
 *
 * The platform owns these pages' content (products, collections, search). Pages that live only in
 * this app (about, FAQ, …) have no Markdown version unless the store adds its own rewrite.
 */

type AcceptEntry = { range: string; quality: number; position: number; specificity: number };

const parseAccept = (accept: string): AcceptEntry[] =>
	accept
		.split(",")
		.map((part, position) => {
			const [range = "", ...params] = part.split(";").map((piece) => piece.trim().toLowerCase());
			const q = params.find((param) => param.startsWith("q="));
			const quality = q ? Number(q.slice(2)) : 1;
			const specificity = range === "*/*" ? 0 : range.endsWith("/*") ? 1 : 2;
			return { range, quality: Number.isFinite(quality) ? quality : 0, position, specificity };
		})
		.filter(({ range }) => range !== "");

const covers = (range: string, type: string) =>
	range === type || range === "*/*" || (range.endsWith("/*") && type.startsWith(range.slice(0, -1)));

/** The entry that decides how much the caller wants `type`: the most specific range covering it, then the earliest. */
const preference = (entries: AcceptEntry[], type: string) =>
	entries
		.filter(({ range }) => covers(range, type))
		.toSorted((a, b) => b.specificity - a.specificity || a.position - b.position)[0];

const ranksFirst = (a: AcceptEntry, b: AcceptEntry | undefined) =>
	!b || a.quality > b.quality || (a.quality === b.quality && a.position < b.position);

/**
 * True when the caller prefers Markdown to HTML, weighing quality values, specificity and order
 * (adapted from vercel/shop's `prefersMarkdown`, MIT). Markdown has to be named, as `text/markdown`
 * or `text/plain`; a `*` wildcard alone never counts, so a browser always gets HTML.
 */
export const prefersMarkdown = (accept: string | null) => {
	if (!accept) return false;
	const entries = parseAccept(accept);
	const markdown = ["text/markdown", "text/plain"]
		.map((type) => preference(entries, type))
		.filter((entry): entry is AcceptEntry => !!entry && entry.specificity === 2 && entry.quality > 0)
		.toSorted((a, b) => (ranksFirst(a, b) ? -1 : 1))[0];
	return !!markdown && ranksFirst(markdown, preference(entries, "text/html"));
};

const pageRoute = (page: string) => {
	if (page === "/") return "/md";
	if (page === "/search") return "/md/search";
	if (/^\/(product|collection)\/[^/]+$/.test(page)) return `/md${page}`;
	return null;
};

/** The platform's Markdown route for a page (`/product/x` → `/md/product/x`), or null when the page has no Markdown version. */
export const markdownPath = (pathname: string) => pageRoute(pathname);

/** `/product/x.md` → the Markdown route for `/product/x`; `/index.md` is the home page. */
const markdownMirrorPath = (pathname: string) => {
	if (!pathname.endsWith(".md")) return null;
	const page = pathname.slice(0, -".md".length).replace(/\/index$/, "");
	return markdownPath(page || "/");
};

/** The platform route (path and query) to rewrite a request to, keeping the page's own query (`?q=`, `?variant=`). */
export const markdownRewritePath = (request: Request) => {
	if (request.method !== "GET" && request.method !== "HEAD") return null;
	const url = new URL(request.url);
	const route =
		markdownMirrorPath(url.pathname) ??
		(prefersMarkdown(request.headers.get("accept")) ? markdownPath(url.pathname) : null);
	if (!route) return null;
	const [path = "", routeQuery = ""] = route.split("?");
	const query = new URLSearchParams({
		...Object.fromEntries(url.searchParams),
		...Object.fromEntries(new URLSearchParams(routeQuery)),
	}).toString();
	return query ? `${path}?${query}` : path;
};
