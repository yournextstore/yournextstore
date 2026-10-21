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
						className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-gray-800"
						strokeWidth={2}
					/>
					<input
						ref={inputRef}
						id={`${listboxId}-input`}
						type="search"
						name="q"
						placeholder="Search for products"
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
						className="fc-input h-[42px] pr-10 [&::-webkit-search-cancel-button]:hidden"
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
