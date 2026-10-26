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
	window.addEventListener(URL_CHANGE, notify);
	return () => {
		window.removeEventListener("popstate", notify);
		window.removeEventListener(URL_CHANGE, notify);
	};
};

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
