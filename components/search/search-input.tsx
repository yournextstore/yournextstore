"use client";

import { useSearchParams } from "next/navigation";
import { useId, useRef, useState } from "react";
import { SearchIcon } from "@/components/icons";
import { Suggestions } from "@/components/search/suggestions";
import {
	getActiveId,
	makeKeyHandler,
	makeNavHandlers,
	useSearchController,
} from "@/components/search/use-search-controller";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/**
 * Header search, md and up: a magnifier that slides open a hairline-underlined field, with
 * live suggestions dropping below it. A second press on the magnifier searches (or closes
 * the field when it is empty); Escape closes it.
 */
export function SearchInput() {
	const searchParams = useSearchParams();
	const c = useSearchController(searchParams.get("q") ?? "");

	const [expanded, setExpanded] = useState(false);
	const [panelRequested, setPanelRequested] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const anchorRef = useRef<HTMLDivElement>(null);
	const listboxId = useId();

	const collapse = () => {
		setPanelRequested(false);
		setExpanded(false);
		inputRef.current?.blur();
	};
	const { goToSearch, goToProduct, handleSubmit } = makeNavHandlers(c, collapse);

	const panelOpen = expanded && panelRequested && c.enoughChars;

	const onIconPress = () => {
		if (!expanded) {
			setExpanded(true);
			inputRef.current?.focus();
			return;
		}
		if (c.query.trim()) {
			goToSearch(c.query);
			return;
		}
		collapse();
	};

	return (
		<form onSubmit={handleSubmit} className="flex items-center max-md:hidden">
			<button
				type="button"
				onClick={onIconPress}
				// Keep focus in the field, so its blur does not collapse it under the click.
				onMouseDown={(e) => e.preventDefault()}
				aria-label={expanded ? "Submit search" : "Open search"}
				className="inline-flex size-8 items-center justify-center"
			>
				<SearchIcon className="size-5" />
			</button>
			<Popover open={panelOpen} onOpenChange={setPanelRequested}>
				<div
					ref={anchorRef}
					className={cn("overflow-hidden transition-[width] duration-500", expanded ? "w-30" : "w-0")}
				>
					<input
						ref={inputRef}
						type="search"
						name="q"
						aria-label="Search products"
						tabIndex={expanded ? 0 : -1}
						value={c.query}
						onChange={(e) => {
							c.setQuery(e.target.value);
							setPanelRequested(true);
						}}
						onFocus={() => {
							setExpanded(true);
							setPanelRequested(true);
						}}
						onBlur={() => {
							if (!c.query.trim()) setExpanded(false);
						}}
						onKeyDown={makeKeyHandler(c, panelOpen, collapse, () => goToSearch(c.query))}
						role="combobox"
						aria-expanded={panelOpen}
						aria-controls={listboxId}
						aria-autocomplete="list"
						aria-activedescendant={getActiveId(listboxId, c, panelOpen)}
						autoComplete="off"
						className="ml-1 h-6 w-[calc(100%-0.25rem)] rounded-none border-0 border-b border-current bg-transparent px-0 text-body text-current focus:outline-none [&::-webkit-search-cancel-button]:hidden"
					/>
				</div>
				<PopoverContent
					align="end"
					sideOffset={25}
					anchor={anchorRef}
					initialFocus={false}
					className="w-[min(24.5rem,calc(100vw-2rem))] rounded-xs border border-grayscale-200 bg-background ring-0 p-1.5 text-foreground shadow-none"
				>
					<Suggestions
						listboxId={listboxId}
						open={panelOpen}
						c={c}
						onPick={goToProduct}
						onSeeAll={() => goToSearch(c.query)}
					/>
				</PopoverContent>
			</Popover>
		</form>
	);
}
