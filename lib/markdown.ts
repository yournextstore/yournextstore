/**
 * The storefront pages that also answer in Markdown, for AI agents. An agent asks for Markdown with
 * `Accept: text/markdown` (or `text/plain`) or by adding `.md` to the address; the proxy then
 * rewrites the request to the platform's `/<subdomain>/md/…` route for that page.
 */

/** True when the caller asked for Markdown and did not ask for HTML in preference to it. */
export const wantsMarkdown = (accept: string | null) =>
	!!accept && /text\/(markdown|plain)/i.test(accept) && !/^\s*text\/html/i.test(accept);

/** The platform's Markdown route for a page, or null when the page has no Markdown version. */
export const markdownPath = (pathname: string) => {
	if (pathname === "/") return "/md";
	if (pathname === "/search") return "/md/search";
	if (/^\/(product|collection)\/[^/]+$/.test(pathname)) return `/md${pathname}`;
	return null;
};

/** `/product/x.md` → the Markdown route for `/product/x`; `/index.md` stands for the home page. */
const markdownMirrorPath = (pathname: string) => {
	if (!pathname.endsWith(".md")) return null;
	const page = pathname.slice(0, -".md".length);
	return markdownPath(page === "/index" ? "/" : page);
};

export const markdownRewritePath = (request: Request) => {
	if (request.method !== "GET" && request.method !== "HEAD") return null;
	const { pathname } = new URL(request.url);
	return (
		markdownMirrorPath(pathname) ??
		(wantsMarkdown(request.headers.get("accept")) ? markdownPath(pathname) : null)
	);
};
