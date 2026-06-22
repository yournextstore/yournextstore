"use client";

import { Search } from "lucide-react";
import { useId, useRef } from "react";
import { Suggestions } from "@/components/search/suggestions";
import {
	getActiveId,
	makeKeyHandler,
	makeNavHandlers,
	useSearchController,
} from "@/components/search/use-search-controller";

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
		<search>
			<form onSubmit={handleSubmit}>
				<label htmlFor={`${listboxId}-input`} className="sr-only">
					Search products
				</label>
				<div className="relative">
					<Search
						className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-ink/50"
						strokeWidth={1.75}
					/>
					<input
						ref={inputRef}
						id={`${listboxId}-input`}
						type="search"
						name="q"
						placeholder="Search snacks…"
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
						className="h-12 w-full rounded-full border border-brand-ink/15 bg-brand-cream/60 pl-12 pr-4 text-base placeholder:text-brand-ink/50 focus:outline-none focus:border-brand-coral focus:bg-white focus:ring-2 focus:ring-brand-coral/20 transition-colors"
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
		</search>
	);
}
