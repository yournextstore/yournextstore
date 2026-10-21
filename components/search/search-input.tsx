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
import { cn } from "@/lib/utils";

/**
 * The original's grey search pill. Suggestions drop out of it as a cream panel, and the pill
 * squares off its bottom corners while the panel is open, as Eyesome's did.
 * No `useSearchParams`, so the header keeps it in the prerendered shell.
 */
export function SearchInput({ className }: { className?: string }) {
	const c = useSearchController("");
	const [focused, setFocused] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const listboxId = useId();

	const close = () => {
		setFocused(false);
		inputRef.current?.blur();
	};
	const { goToSearch, goToProduct, handleSubmit } = makeNavHandlers(c, close);
	const panelOpen = focused && c.enoughChars;

	return (
		<search
			className={cn("relative", className)}
			onBlur={(e) => {
				if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
			}}
		>
			<form
				onSubmit={handleSubmit}
				className={cn(
					"flex items-center bg-black/[0.075] px-3 text-sm transition-[border-radius]",
					panelOpen ? "rounded-t-2xl" : "rounded-full",
				)}
			>
				<label htmlFor={`${listboxId}-input`} className="sr-only">
					Search products
				</label>
				<input
					ref={inputRef}
					id={`${listboxId}-input`}
					type="search"
					name="q"
					placeholder="Search Products"
					value={c.query}
					onChange={(e) => c.setQuery(e.target.value)}
					onFocus={() => setFocused(true)}
					onKeyDown={makeKeyHandler(c, panelOpen, close, () => goToSearch(c.query))}
					role="combobox"
					aria-expanded={panelOpen}
					aria-controls={listboxId}
					aria-autocomplete="list"
					aria-activedescendant={getActiveId(listboxId, c, panelOpen)}
					enterKeyHint="search"
					autoComplete="off"
					className="h-9 w-full bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
				/>
				<button type="submit" aria-label="Search" className="-mr-1 rounded-full p-1.5 hover:bg-black/5">
					<Search className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
				</button>
			</form>
			{panelOpen ? (
				<div className="absolute inset-x-0 top-full z-20 max-h-80 overflow-auto rounded-b-2xl bg-popover p-1.5 shadow-md">
					<Suggestions
						listboxId={listboxId}
						open={panelOpen}
						c={c}
						onPick={goToProduct}
						onSeeAll={() => goToSearch(c.query)}
					/>
				</div>
			) : null}
		</search>
	);
}
