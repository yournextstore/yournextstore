"use client";

import { useId, useRef } from "react";
import { SearchIcon } from "@/components/icons";
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
					<SearchIcon className="pointer-events-none absolute left-0 top-1/2 size-5 -translate-y-1/2" />
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
						className="h-8 w-full border-0 border-b border-transparent bg-transparent pl-9 pr-0 text-base text-current placeholder:text-current/60 focus:outline-none focus-visible:border-current"
					/>
				</div>
				{panelOpen ? (
					<div className="mt-4 rounded-xs bg-background p-1 text-foreground">
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
