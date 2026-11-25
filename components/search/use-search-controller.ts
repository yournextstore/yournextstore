"use client";

import { useRouter } from "next/navigation";
import type { FormEvent, KeyboardEvent } from "react";
import { useEffect, useRef, useState, useTransition } from "react";
import {
	fetchSearchSuggestions,
	type SearchSuggestion,
	type SearchSuggestions,
	type SuggestedBrand,
	type SuggestedCategory,
} from "@/lib/search-suggest";

const DEBOUNCE_MS = 200;
const MIN_QUERY_LENGTH = 2;
const SUGGESTION_CACHE_LIMIT = 32;

const NO_SUGGESTIONS: SearchSuggestions = { products: [], queries: [], categories: [], brands: [] };

const suggestionCache = new Map<string, SearchSuggestions>();
const pendingSuggestions = new Map<string, Promise<SearchSuggestions | null>>();

async function getSuggestions(query: string): Promise<SearchSuggestions> {
	const cached = suggestionCache.get(query);
	if (cached) return cached;
	// One request per query at a time: a focus during the idle prefetch waits for that request.
	const pending = pendingSuggestions.get(query) ?? fetchSearchSuggestions(query);
	pendingSuggestions.set(query, pending);
	const suggestions = await pending.finally(() => pendingSuggestions.delete(query));
	// A failed fetch shows no suggestions this time and is asked again on the next keystroke.
	if (!suggestions) return NO_SUGGESTIONS;
	if (suggestionCache.size >= SUGGESTION_CACHE_LIMIT) {
		// The empty box's answer stays: it is what every focus of the empty field shows.
		const oldest = [...suggestionCache.keys()].find((key) => key !== "");
		if (oldest !== undefined) suggestionCache.delete(oldest);
	}
	suggestionCache.set(query, suggestions);
	return suggestions;
}

const PREFETCH_FALLBACK_MS = 1500;
const prefetch = { scheduled: false };

/**
 * Asks for the empty box's suggestions once per page load, when the browser is idle, so focusing
 * the empty field shows them at once. Kept in memory across client-side navigation.
 */
function prefetchEmptyBox() {
	if (prefetch.scheduled) return;
	prefetch.scheduled = true;
	const run = () => void getSuggestions("");
	if ("requestIdleCallback" in window) window.requestIdleCallback(run, { timeout: 3000 });
	else setTimeout(run, PREFETCH_FALLBACK_MS);
}

/** One row of the suggestions, in the order the arrow keys move through them. */
export type SuggestionOption =
	| { kind: "query"; key: string; query: string }
	| { kind: "category"; key: string; category: SuggestedCategory }
	| { kind: "brand"; key: string; brand: SuggestedBrand }
	| { kind: "product"; key: string; product: SearchSuggestion; position: number }
	| { kind: "seeAll"; key: string };

const optionsOf = (suggestions: SearchSuggestions, seeAll: boolean): SuggestionOption[] => [
	// By place, not text: an element id cannot hold the query's spaces.
	...suggestions.queries.map((query, index) => ({ kind: "query" as const, key: `query-${index}`, query })),
	...suggestions.categories.map((category) => ({
		kind: "category" as const,
		key: `category-${category.id}`,
		category,
	})),
	...suggestions.brands.map((brand) => ({ kind: "brand" as const, key: `brand-${brand.id}`, brand })),
	...suggestions.products.map((product, index) => ({
		kind: "product" as const,
		key: `product-${product.id}`,
		product,
		position: index + 1,
	})),
	...(seeAll ? [{ kind: "seeAll" as const, key: "see-all" }] : []),
];

export function useSearchController(initialQuery: string) {
	const router = useRouter();
	const [query, setQuery] = useState(initialQuery);
	// Focused at least once: only then is the empty box worth its popular queries and products.
	const [active, setActive] = useState(false);
	const [suggestions, setSuggestions] = useState<SearchSuggestions>(NO_SUGGESTIONS);
	const [hasFetched, setHasFetched] = useState(false);
	const [highlight, setHighlight] = useState(-1);
	const [isFetching, startFetch] = useTransition();
	const requestIdRef = useRef(0);

	const trimmed = query.trim();
	const enoughChars = trimmed.length >= MIN_QUERY_LENGTH;
	const emptyBox = trimmed === "";
	// What to ask for: the typed query, the empty box once focused, or nothing for a single letter.
	const target = enoughChars ? trimmed : emptyBox && active ? "" : null;
	const hasResults =
		suggestions.products.length +
			suggestions.queries.length +
			suggestions.categories.length +
			suggestions.brands.length >
		0;
	const options = optionsOf(suggestions, enoughChars && hasResults);
	const lastIndex = options.length - 1;
	// The empty box opens only when there is something to show; a typed query always does.
	const showPanel = enoughChars || (emptyBox && active && hasFetched && hasResults);

	useEffect(() => {
		const requestId = ++requestIdRef.current;
		if (target === null) {
			setSuggestions(NO_SUGGESTIONS);
			setHasFetched(false);
			return;
		}
		// Asked before (or prefetched): shown at once, without the debounce or a request.
		const cached = suggestionCache.get(target);
		if (cached) {
			setSuggestions(cached);
			setHasFetched(true);
			setHighlight(-1);
			return;
		}
		const timer = setTimeout(
			() => {
				startFetch(async () => {
					const next = await getSuggestions(target);
					if (requestId !== requestIdRef.current) return;
					setSuggestions(next);
					setHasFetched(true);
					setHighlight(-1);
				});
			},
			target ? DEBOUNCE_MS : 0,
		);
		return () => clearTimeout(timer);
	}, [target]);

	useEffect(prefetchEmptyBox, []);

	useEffect(() => {
		if (!enoughChars) return;
		router.prefetch(`/search?q=${encodeURIComponent(trimmed)}`);
	}, [trimmed, enoughChars]);

	return {
		query,
		setQuery,
		activate: () => setActive(true),
		suggestions,
		options,
		hasFetched,
		hasResults,
		highlight,
		setHighlight,
		isFetching,
		trimmed,
		enoughChars,
		showPanel,
		lastIndex,
		router,
	};
}

export type Controller = ReturnType<typeof useSearchController>;

export function makeKeyHandler(
	c: Controller,
	open: boolean,
	onClose: () => void,
	onPick: (option: SuggestionOption) => void,
) {
	return (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Escape") {
			onClose();
			return;
		}
		if (!open || c.lastIndex < 0) return;
		if (e.key === "ArrowDown") {
			e.preventDefault();
			c.setHighlight((h) => (h >= c.lastIndex ? 0 : h + 1));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			c.setHighlight((h) => (h <= 0 ? c.lastIndex : h - 1));
		} else if (e.key === "Enter") {
			const picked = c.options[c.highlight];
			if (picked) {
				e.preventDefault();
				onPick(picked);
			}
		}
	};
}

/** Where a suggestion leads: a brand has no page of its own, so it is searched for. */
export const suggestionHref = (option: SuggestionOption, query: string) => {
	switch (option.kind) {
		case "query":
			return `/search?q=${encodeURIComponent(option.query)}`;
		case "category":
			return `/category/${option.category.path.map(encodeURIComponent).join("/")}`;
		case "brand":
			return `/search?q=${encodeURIComponent(option.brand.name)}`;
		case "product":
			return `/product/${option.product.slug}`;
		case "seeAll":
			return `/search?q=${encodeURIComponent(query.trim())}`;
	}
};

export function makeNavHandlers(c: Controller, onClose: () => void) {
	const goToSearch = (q: string) => {
		const value = q.trim();
		if (!value) return;
		c.router.push(`/search?q=${encodeURIComponent(value)}`);
		onClose();
	};
	const pick = (option: SuggestionOption) => {
		c.router.push(suggestionHref(option, c.query));
		onClose();
	};
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const picked = c.options[c.highlight];
		if (picked) pick(picked);
		else goToSearch(c.query);
	};
	return { goToSearch, pick, handleSubmit };
}

export function getActiveId(listboxId: string, c: Controller, open: boolean) {
	if (!open || c.highlight < 0) return undefined;
	const option = c.options[c.highlight];
	return option ? `${listboxId}-${option.key}` : undefined;
}
