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
						className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500"
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
						className="h-12 w-full rounded-md border border-field-border bg-field pr-3 pl-12 text-base text-ink placeholder:text-neutral-500 focus:border-blue-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
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
