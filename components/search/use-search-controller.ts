"use client";

import { useRouter } from "next/navigation";
import type { FormEvent, KeyboardEvent } from "react";
import { useEffect, useRef, useState, useTransition } from "react";
import { type SearchSuggestion, searchSuggest } from "@/app/search-suggest";

const DEBOUNCE_MS = 200;
const MIN_QUERY_LENGTH = 2;
const SUGGESTION_CACHE_LIMIT = 32;

const suggestionCache = new Map<string, SearchSuggestion[]>();

async function getSuggestions(query: string): Promise<SearchSuggestion[]> {
	const cached = suggestionCache.get(query);
	if (cached) return cached;
	const items = await searchSuggest(query);
	if (suggestionCache.size >= SUGGESTION_CACHE_LIMIT) {
		const oldest = suggestionCache.keys().next().value;
		if (oldest !== undefined) suggestionCache.delete(oldest);
	}
	suggestionCache.set(query, items);
	return items;
}

export function useSearchController(initialQuery: string) {
	const router = useRouter();
	const [query, setQuery] = useState(initialQuery);
	const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
	const [hasFetched, setHasFetched] = useState(false);
	const [highlight, setHighlight] = useState(-1);
	const [isFetching, startFetch] = useTransition();
	const requestIdRef = useRef(0);

	const trimmed = query.trim();
	const enoughChars = trimmed.length >= MIN_QUERY_LENGTH;
	const hasResults = suggestions.length > 0;
	const seeAllIndex = enoughChars ? suggestions.length : -1;
	const lastIndex = seeAllIndex >= 0 ? seeAllIndex : suggestions.length - 1;

	useEffect(() => {
		if (!enoughChars) {
			setSuggestions([]);
			setHasFetched(false);
			return;
		}
		const requestId = ++requestIdRef.current;
		const timer = setTimeout(() => {
			startFetch(async () => {
				const items = await getSuggestions(trimmed);
				if (requestId !== requestIdRef.current) return;
				setSuggestions(items);
				setHasFetched(true);
				setHighlight(-1);
			});
		}, DEBOUNCE_MS);
		return () => clearTimeout(timer);
	}, [trimmed, enoughChars]);

	useEffect(() => {
		if (!enoughChars) return;
		router.prefetch(`/search?q=${encodeURIComponent(trimmed)}`);
	}, [trimmed, enoughChars]);

	return {
		query,
		setQuery,
		suggestions,
		hasFetched,
		hasResults,
		highlight,
		setHighlight,
		isFetching,
		trimmed,
		enoughChars,
		seeAllIndex,
		lastIndex,
		router,
	};
}

export type Controller = ReturnType<typeof useSearchController>;

export function makeKeyHandler(c: Controller, open: boolean, onClose: () => void, onSeeAll: () => void) {
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
		} else if (e.key === "Enter" && c.highlight === c.seeAllIndex) {
			e.preventDefault();
			onSeeAll();
		}
	};
}

export function makeNavHandlers(c: Controller, onClose: () => void) {
	const goToSearch = (q: string) => {
		const value = q.trim();
		if (!value) return;
		c.router.push(`/search?q=${encodeURIComponent(value)}`);
		onClose();
	};
	const goToProduct = (slug: string) => {
		c.router.push(`/product/${slug}`);
		onClose();
	};
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const picked = c.highlight >= 0 ? c.suggestions[c.highlight] : null;
		if (picked) goToProduct(picked.slug);
		else goToSearch(c.query);
	};
	return { goToSearch, goToProduct, handleSubmit };
}

export function getActiveId(listboxId: string, c: Controller, open: boolean) {
	if (!open || c.highlight < 0) return undefined;
	if (c.highlight === c.seeAllIndex) return `${listboxId}-see-all`;
	const item = c.suggestions[c.highlight];
	return item ? `${listboxId}-${item.id}` : undefined;
}
