"use client";

import { Search } from "lucide-react";
import { type ReactNode, useId, useRef } from "react";
import { Suggestions } from "@/components/search/suggestions";
import {
	getActiveId,
	makeKeyHandler,
	makeNavHandlers,
	useSearchController,
} from "@/components/search/use-search-controller";

export function MobileSearchInput({
	onNavigate,
	placeholder = "Search products",
	trailing,
}: {
	onNavigate: () => void;
	placeholder?: string;
	/** Extra control drawn inside the field after the search glyph (e.g. a filters link). */
	trailing?: ReactNode;
}) {
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
					<input
						ref={inputRef}
						id={`${listboxId}-input`}
						type="search"
						name="q"
						placeholder={placeholder}
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
						className={`h-16 w-full rounded-xl border-0 bg-flash-white pl-5 text-gf-sm text-foreground placeholder:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 [&::-webkit-search-cancel-button]:hidden ${trailing ? "pr-24" : "pr-14"}`}
					/>
					<div className="absolute inset-y-0 right-4 flex items-center gap-2">
						<button
							type="submit"
							aria-label="Search"
							className="inline-flex size-10 items-center justify-center rounded-full hover:bg-light-silver"
						>
							<Search className="size-6" strokeWidth={1.75} />
						</button>
						{trailing}
					</div>
				</div>
				{panelOpen ? (
					<div className="mt-3 rounded-xl bg-white p-1 gf-shadow">
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
