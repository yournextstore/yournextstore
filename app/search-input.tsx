"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { YnsLink } from "@/components/yns-link";
import { YNSMedia } from "@/lib/yns-media";
import { type SearchSuggestion, searchSuggest } from "./search-suggest";

const DEBOUNCE_MS = 200;
const MIN_QUERY_LENGTH = 2;
const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c"] as const;

const suggestionCache = new Map<string, SearchSuggestion[]>();
const SUGGESTION_CACHE_LIMIT = 32;

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

export function SearchInput() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const initialQuery = searchParams.get("q") ?? "";

	const [query, setQuery] = useState(initialQuery);
	const [open, setOpen] = useState(false);
	const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
	const [hasFetched, setHasFetched] = useState(false);
	const [highlight, setHighlight] = useState(-1);
	const [isFetching, startFetch] = useTransition();

	const inputRef = useRef<HTMLInputElement>(null);
	const listboxId = useId();
	const requestIdRef = useRef(0);

	const trimmed = query.trim();
	const hasResults = suggestions.length > 0;
	const seeAllIndex = trimmed.length >= MIN_QUERY_LENGTH ? suggestions.length : -1;
	const lastIndex = seeAllIndex >= 0 ? seeAllIndex : suggestions.length - 1;

	useEffect(() => {
		if (trimmed.length < MIN_QUERY_LENGTH) {
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
	}, [trimmed]);

	useEffect(() => {
		router.prefetch(`/search?q=${encodeURIComponent(trimmed)}`);
	}, [trimmed]);

	const goToSearch = (q: string) => {
		const value = q.trim();
		if (!value) return;
		router.push(`/search?q=${encodeURIComponent(value)}`);
		setOpen(false);
		inputRef.current?.blur();
	};

	const goToProduct = (slug: string) => {
		router.push(`/product/${slug}`);
		setOpen(false);
		inputRef.current?.blur();
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const picked = highlight >= 0 ? suggestions[highlight] : null;
		if (picked) {
			goToProduct(picked.slug);
			return;
		}
		goToSearch(query);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Escape") {
			setOpen(false);
			return;
		}
		if (!open || lastIndex < 0) return;
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setHighlight((h) => (h >= lastIndex ? 0 : h + 1));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setHighlight((h) => (h <= 0 ? lastIndex : h - 1));
		} else if (e.key === "Enter" && highlight === seeAllIndex) {
			e.preventDefault();
			goToSearch(query);
		}
	};

	const showPopover = open && trimmed.length >= MIN_QUERY_LENGTH;
	const showEmpty = showPopover && hasFetched && !isFetching && !hasResults;
	const showSkeleton = showPopover && !hasFetched && isFetching;

	const activeItem = highlight >= 0 ? suggestions[highlight] : undefined;
	const activeId =
		!showPopover || highlight < 0
			? undefined
			: highlight === seeAllIndex
				? `${listboxId}-see-all`
				: activeItem
					? `${listboxId}-${activeItem.id}`
					: undefined;

	return (
		<>
			<form onSubmit={handleSubmit} className="hidden sm:block">
				<Popover open={showPopover} onOpenChange={setOpen}>
					<PopoverAnchor asChild>
						<div className="relative">
							<Search
								className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
								strokeWidth={1.75}
							/>
							<input
								ref={inputRef}
								type="search"
								name="q"
								placeholder="Search products"
								value={query}
								onChange={(e) => {
									setQuery(e.target.value);
									setOpen(true);
								}}
								onFocus={() => setOpen(true)}
								onKeyDown={handleKeyDown}
								role="combobox"
								aria-expanded={showPopover}
								aria-controls={listboxId}
								aria-autocomplete="list"
								aria-activedescendant={activeId}
								autoComplete="off"
								className="h-10 w-56 rounded-full border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
							/>
						</div>
					</PopoverAnchor>
					<PopoverContent
						align="end"
						sideOffset={8}
						collisionPadding={16}
						onOpenAutoFocus={(e) => e.preventDefault()}
						onPointerDownOutside={() => setOpen(false)}
						className="w-[min(22rem,calc(100vw-2rem))] rounded-2xl border-border bg-popover p-1.5 shadow-lg"
					>
						<div
							id={listboxId}
							role="listbox"
							aria-label="Search suggestions"
							className="flex max-h-96 flex-col overflow-y-auto"
						>
							{showSkeleton ? (
								<div className="flex flex-col gap-0.5">
									{SKELETON_KEYS.map((key) => (
										<div key={key} className="flex items-center gap-3 rounded-xl p-2">
											<div className="h-12 w-12 flex-none animate-pulse rounded-lg bg-secondary motion-reduce:animate-none" />
											<div className="flex flex-1 flex-col gap-2">
												<div className="h-3 w-2/3 animate-pulse rounded-full bg-secondary motion-reduce:animate-none" />
												<div className="h-2.5 w-1/2 animate-pulse rounded-full bg-secondary/60 motion-reduce:animate-none" />
											</div>
										</div>
									))}
								</div>
							) : null}

							{hasResults ? (
								<div className="flex flex-col gap-0.5">
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
												onClick={() => goToProduct(item.slug)}
												className={`flex items-center gap-3 rounded-xl p-2 text-left transition-colors ${
													isActive ? "bg-secondary" : "hover:bg-secondary/60"
												}`}
											>
												<div className="relative h-12 w-12 flex-none overflow-hidden rounded-lg bg-secondary">
													{item.image ? (
														<YNSMedia src={item.image} alt="" fill sizes="48px" className="object-cover" />
													) : null}
												</div>
												<div className="flex min-w-0 flex-1 flex-col">
													<HighlightedText
														text={item.name}
														query={trimmed}
														className="truncate text-sm font-medium text-foreground"
													/>
													{item.summary ? (
														<span className="truncate text-xs text-muted-foreground">{item.summary}</span>
													) : null}
												</div>
											</button>
										);
									})}
								</div>
							) : null}

							{showEmpty ? (
								<div className="flex flex-col gap-1 px-3 py-6">
									<span className="text-sm font-medium text-foreground">
										No results for &ldquo;{trimmed}&rdquo;
									</span>
									<span className="text-xs text-muted-foreground">Try a shorter or different word.</span>
								</div>
							) : null}

							{seeAllIndex >= 0 ? (
								<div className="mt-1 border-t border-border pt-1">
									<button
										type="button"
										role="option"
										id={`${listboxId}-see-all`}
										aria-selected={highlight === seeAllIndex}
										onMouseEnter={() => setHighlight(seeAllIndex)}
										onClick={() => goToSearch(query)}
										className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors ${
											highlight === seeAllIndex ? "bg-secondary" : "hover:bg-secondary/60"
										}`}
									>
										<div className="flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-secondary">
											<Search className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
										</div>
										<span className="text-sm text-foreground">
											See all results for <span className="font-medium">&ldquo;{trimmed}&rdquo;</span>
										</span>
									</button>
								</div>
							) : null}
						</div>
					</PopoverContent>
				</Popover>
			</form>
			<YnsLink
				href="/search"
				className="rounded-full p-2 transition-colors hover:bg-secondary sm:hidden"
				aria-label="Search"
			>
				<Search className="h-6 w-6" />
			</YnsLink>
		</>
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
