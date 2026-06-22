"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import { YnsLink } from "@/components/yns-link";
import { YNSMedia } from "@/lib/yns-media";
import { type SearchSuggestion, searchSuggest } from "./search-suggest";

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

function useSearchController(initialQuery: string) {
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

type Controller = ReturnType<typeof useSearchController>;

function makeKeyHandler(c: Controller, open: boolean, onClose: () => void, onSeeAll: () => void) {
	return (e: React.KeyboardEvent<HTMLInputElement>) => {
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

function makeNavHandlers(c: Controller, onClose: () => void) {
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
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const picked = c.highlight >= 0 ? c.suggestions[c.highlight] : null;
		if (picked) goToProduct(picked.slug);
		else goToSearch(c.query);
	};
	return { goToSearch, goToProduct, handleSubmit };
}

function getActiveId(listboxId: string, c: Controller, open: boolean) {
	if (!open || c.highlight < 0) return undefined;
	if (c.highlight === c.seeAllIndex) return `${listboxId}-see-all`;
	const item = c.suggestions[c.highlight];
	return item ? `${listboxId}-${item.id}` : undefined;
}

function Suggestions({
	listboxId,
	open,
	c,
	onPick,
	onSeeAll,
}: {
	listboxId: string;
	open: boolean;
	c: Controller;
	onPick: (slug: string) => void;
	onSeeAll: () => void;
}) {
	const { suggestions, hasFetched, hasResults, highlight, setHighlight, isFetching, trimmed, seeAllIndex } =
		c;
	const showSkeleton = open && !hasFetched && isFetching;
	const showEmpty = open && hasFetched && !isFetching && !hasResults;

	return (
		<div
			id={listboxId}
			role="listbox"
			aria-label="Search suggestions"
			className="flex max-h-96 flex-col overflow-y-auto"
		>
			{showSkeleton
				? [0, 1, 2].map((i) => (
						<div key={`sk-${i}`} className="flex items-center gap-4 border-b border-border py-3">
							<span className="h-10 w-10 flex-none animate-pulse bg-secondary motion-reduce:animate-none" />
							<span className="flex flex-1 flex-col gap-2">
								<span className="block h-3 w-2/3 animate-pulse bg-secondary motion-reduce:animate-none" />
								<span className="block h-2.5 w-1/2 animate-pulse bg-secondary/60 motion-reduce:animate-none" />
							</span>
						</div>
					))
				: null}

			{suggestions.map((item, idx) => {
				const isActive = idx === highlight;
				return (
					<button
						key={item.id}
						type="button"
						role="option"
						id={`${listboxId}-${item.id}`}
						aria-selected={isActive}
						onMouseEnter={() => setHighlight(idx)}
						onClick={() => onPick(item.slug)}
						className={`flex items-center gap-4 border-b border-border py-3 text-left transition-opacity ${
							isActive ? "opacity-100" : "opacity-80 hover:opacity-100"
						}`}
					>
						<span className="relative h-10 w-10 flex-none overflow-hidden bg-secondary">
							{item.image ? (
								<YNSMedia src={item.image} alt={item.name} fill sizes="40px" className="object-cover" />
							) : null}
						</span>
						<span className="flex min-w-0 flex-1 flex-col">
							<HighlightedText
								text={item.name}
								query={trimmed}
								className="truncate text-base font-medium text-foreground"
							/>
							{item.summary ? (
								<span className="truncate text-xs text-muted-foreground">{item.summary}</span>
							) : null}
						</span>
						<span
							aria-hidden
							className={`text-foreground transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`}
						>
							→
						</span>
					</button>
				);
			})}

			{showEmpty ? (
				<div className="flex flex-col gap-2 border-b border-border py-6">
					<span className="text-base font-medium text-foreground">Nothing for &ldquo;{trimmed}&rdquo;</span>
					<span className="text-xs text-muted-foreground">Try a shorter or different word.</span>
				</div>
			) : null}

			{seeAllIndex >= 0 && hasResults ? (
				<button
					type="button"
					role="option"
					id={`${listboxId}-see-all`}
					aria-selected={highlight === seeAllIndex}
					onMouseEnter={() => setHighlight(seeAllIndex)}
					onClick={onSeeAll}
					className={`flex items-center justify-between py-3 text-left transition-opacity ${
						highlight === seeAllIndex ? "opacity-100" : "opacity-80 hover:opacity-100"
					}`}
				>
					<span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
						See all results for{" "}
						<span className="font-medium normal-case tracking-normal text-foreground">{trimmed}</span>
					</span>
					<span aria-hidden className="text-foreground">
						→
					</span>
				</button>
			) : null}
		</div>
	);
}

export function SearchInput() {
	const searchParams = useSearchParams();
	const c = useSearchController(searchParams.get("q") ?? "");

	const [iconOpen, setIconOpen] = useState(false);
	const [inlineOpen, setInlineOpen] = useState(false);
	const iconInputRef = useRef<HTMLInputElement>(null);
	const inlineInputRef = useRef<HTMLInputElement>(null);
	const iconListboxId = useId();
	const inlineListboxId = useId();

	const { goToSearch, goToProduct, handleSubmit } = makeNavHandlers(c, () => {
		setIconOpen(false);
		setInlineOpen(false);
		iconInputRef.current?.blur();
		inlineInputRef.current?.blur();
	});

	const iconPanelOpen = iconOpen && c.enoughChars;
	const inlinePanelOpen = inlineOpen && c.enoughChars;

	return (
		<>
			<form onSubmit={handleSubmit} className="hidden sm:block">
				<div className="relative">
					<Search
						className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
						strokeWidth={1.5}
					/>
					<input
						ref={iconInputRef}
						type="search"
						name="q"
						placeholder="Search designers, pieces"
						defaultValue={searchParams.get("q") ?? ""}
						className="h-10 w-52 rounded-full bg-secondary/70 pl-9 pr-3 text-[11px] uppercase tracking-[0.18em] text-foreground placeholder:text-muted-foreground/80 focus:bg-background focus:outline-none focus:ring-1 focus:ring-foreground/20"
					/>
				</div>
			</form>
			<YnsLink
				href="/search"
				className="rounded-full p-2 hover:bg-lilac-soft transition-colors sm:hidden"
				aria-label="Search"
			>
				<Search className="h-5 w-5" strokeWidth={1.5} />
			</YnsLink>
		</>
	);
}

export function MobileSearchInput({ onNavigate }: { onNavigate: () => void }) {
	const c = useSearchController("");
	const inputRef = useRef<HTMLInputElement>(null);
	const listboxId = useId();

	const close = () => {
		inputRef.current?.blur();
		onNavigate();
	};
	const { goToSearch, goToProduct, handleSubmit } = makeNavHandlers(c, close);

	const panelOpen = c.enoughChars;

	return (
		<form onSubmit={handleSubmit} role="search">
			<label htmlFor={`${listboxId}-input`} className="sr-only">
				Search products
			</label>
			<div className="relative">
				<Search
					className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
					strokeWidth={1.75}
				/>
				<input
					ref={inputRef}
					id={`${listboxId}-input`}
					type="search"
					name="q"
					placeholder="Search products"
					value={c.query}
					onChange={(e) => c.setQuery(e.target.value)}
					onKeyDown={makeKeyHandler(c, panelOpen, close, () => goToSearch(c.query))}
					role="combobox"
					aria-expanded={panelOpen}
					aria-controls={listboxId}
					aria-autocomplete="list"
					aria-activedescendant={getActiveId(listboxId, c, panelOpen)}
					enterKeyHint="search"
					autoComplete="off"
					className="h-12 w-full rounded-full border border-border bg-background pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
				/>
			</div>
			{panelOpen ? (
				<div className="mt-3 border-t border-border pt-1">
					<Suggestions
						listboxId={listboxId}
						open={panelOpen}
						c={c}
						onPick={goToProduct}
						onSeeAll={() => goToSearch(c.query)}
					/>
				</div>
			) : null}
		</form>
	);
}

export function SearchPageInput({ initialQuery }: { initialQuery: string }) {
	const c = useSearchController(initialQuery);
	const [interactive, setInteractive] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const listboxId = useId();

	const close = () => {
		setInteractive(false);
		inputRef.current?.blur();
	};
	const { goToSearch, goToProduct, handleSubmit } = makeNavHandlers(c, close);

	const panelOpen = interactive && c.enoughChars;

	return (
		<form onSubmit={handleSubmit} role="search">
			<label htmlFor={`${listboxId}-input`} className="sr-only">
				Search products
			</label>
			<div className="relative border-b border-foreground/30 transition-colors focus-within:border-foreground">
				<Search
					className="pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/60"
					strokeWidth={1.5}
				/>
				<input
					ref={inputRef}
					id={`${listboxId}-input`}
					type="search"
					name="q"
					placeholder="Search the store"
					value={c.query}
					onFocus={() => setInteractive(true)}
					onBlur={() => setTimeout(() => setInteractive(false), 120)}
					onChange={(e) => {
						setInteractive(true);
						c.setQuery(e.target.value);
					}}
					onKeyDown={makeKeyHandler(c, panelOpen, close, () => goToSearch(c.query))}
					role="combobox"
					aria-expanded={panelOpen}
					aria-controls={listboxId}
					aria-autocomplete="list"
					aria-activedescendant={getActiveId(listboxId, c, panelOpen)}
					enterKeyHint="search"
					autoComplete="off"
					className="h-14 w-full border-0 bg-transparent pl-8 pr-2 text-2xl font-medium tracking-tight text-foreground placeholder:font-medium placeholder:text-foreground/40 focus:outline-none sm:text-3xl"
				/>
			</div>
			{panelOpen ? (
				<div className="mt-4 border-t border-border pt-2">
					<Suggestions
						listboxId={listboxId}
						open={panelOpen}
						c={c}
						onPick={goToProduct}
						onSeeAll={() => goToSearch(c.query)}
					/>
				</div>
			) : null}
		</form>
	);
}

function HighlightedText({ text, query, className }: { text: string; query: string; className?: string }) {
	if (!query) return <span className={className}>{text}</span>;
	const idx = text.toLowerCase().indexOf(query.toLowerCase());
	if (idx === -1) return <span className={className}>{text}</span>;
	return (
		<span className={className}>
			{text.slice(0, idx)}
			<mark className="bg-transparent font-semibold text-foreground">
				{text.slice(idx, idx + query.length)}
			</mark>
			{text.slice(idx + query.length)}
		</span>
	);
}
