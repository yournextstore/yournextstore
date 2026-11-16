"use client";

import { useSyncExternalStore } from "react";

const URL_CHANGE = "yns:url-change";

let watchingHistory = false;

/** Wraps `history.pushState`/`replaceState` once, so every address change (Next's navigations included) is announced. */
const watchHistory = () => {
	if (watchingHistory) return;
	watchingHistory = true;
	const { pushState, replaceState } = window.history;
	window.history.pushState = function ynsPushState(...args) {
		pushState.apply(this, args);
		window.dispatchEvent(new Event(URL_CHANGE));
	};
	window.history.replaceState = function ynsReplaceState(...args) {
		replaceState.apply(this, args);
		window.dispatchEvent(new Event(URL_CHANGE));
	};
};

const subscribe = (notify: () => void) => {
	watchHistory();
	window.addEventListener("popstate", notify);
	// An address typed or pasted with a new `#…` on the same page changes nothing but the hash.
	window.addEventListener("hashchange", notify);
	window.addEventListener(URL_CHANGE, notify);
	return () => {
		window.removeEventListener("popstate", notify);
		window.removeEventListener("hashchange", notify);
		window.removeEventListener(URL_CHANGE, notify);
	};
};

/**
 * The chosen variant as it stands in an address: after `#` (`#Colour=Black&Size=M`), which is how the product
 * page writes it, or in the query (`?Colour=Black`), which older links, ads and product feeds still use. A hash
 * with no `=` is an ordinary anchor (`#reviews`) and says nothing about the variant.
 */
export const variantQueryOf = (hash: string, search: string) =>
	hash.includes("=") ? hash.replace(/^#/, "") : search.replace(/^\?/, "");

/** The variant part of a product address: `#Colour=Black&Size=M`, or nothing when no option is chosen. */
export const variantHash = (params: URLSearchParams) => (params.size > 0 ? `#${params.toString()}` : "");

/**
 * The chosen variant read from the address in the browser, like `useUrlQuery`. Search engines treat every query
 * string as a separate address to crawl and drop everything after `#`, so the choice lives after `#`.
 */
export function useVariantQuery(): URLSearchParams {
	const query = useSyncExternalStore(
		subscribe,
		() => variantQueryOf(window.location.hash, window.location.search),
		() => "",
	);
	return new URLSearchParams(query);
}

/**
 * The page's query string read from `location.search` instead of `useSearchParams()`. A prerendered page renders
 * with an empty query (the server never sees it) and switches to the real one after hydration, so the component
 * stays in the static shell; `useSearchParams()` would make it a per-request render behind a Suspense fallback.
 */
export function useUrlQuery(): URLSearchParams {
	const search = useSyncExternalStore(
		subscribe,
		() => window.location.search,
		() => "",
	);
	return new URLSearchParams(search);
}

/** Writes a new address to history; Next keeps its router in sync and `useUrlQuery` readers update. */
export function setUrlQuery(url: string, { replace = false }: { replace?: boolean } = {}) {
	if (replace) window.history.replaceState(null, "", url);
	else window.history.pushState(null, "", url);
}
