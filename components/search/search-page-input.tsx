"use client";

import { Search } from "lucide-react";
import { useId, useRef, useState } from "react";
import { Suggestions } from "@/components/search/suggestions";
import {
	getActiveId,
	makeKeyHandler,
	makeNavHandlers,
	useSearchController,
} from "@/components/search/use-search-controller";

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
		<search>
			<form onSubmit={handleSubmit}>
				<label htmlFor={`${listboxId}-input`} className="sr-only">
					Search products
				</label>
				<div className="relative">
					<Search
						className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
						strokeWidth={1.5}
					/>
					<input
						ref={inputRef}
						id={`${listboxId}-input`}
						type="search"
						name="q"
						placeholder="Search drinks…"
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
						className="h-12 w-full rounded-full border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-yns-yellow)]/40 focus:border-white/30 transition-all"
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
		</search>
	);
}
