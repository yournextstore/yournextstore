"use client";

import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useId, useRef, useState } from "react";
import { Suggestions } from "@/components/search/suggestions";
import {
	getActiveId,
	makeKeyHandler,
	makeNavHandlers,
	useSearchController,
} from "@/components/search/use-search-controller";
import { Popover, PopoverContent } from "@/components/ui/popover";

// Desktop inline search (sm and up). Below sm the header shows a plain icon link to /search instead.
export function SearchInput() {
	const searchParams = useSearchParams();
	const c = useSearchController(searchParams.get("q") ?? "");

	const [inlineOpen, setInlineOpen] = useState(false);
	const inlineInputRef = useRef<HTMLInputElement>(null);
	const inlineAnchorRef = useRef<HTMLDivElement>(null);
	const inlineListboxId = useId();

	const { goToSearch, goToProduct, handleSubmit } = makeNavHandlers(c, () => {
		setInlineOpen(false);
		inlineInputRef.current?.blur();
	});

	const inlinePanelOpen = inlineOpen && c.enoughChars;

	return (
		<form onSubmit={handleSubmit} className="hidden sm:block">
			<Popover open={inlinePanelOpen} onOpenChange={setInlineOpen}>
				<div ref={inlineAnchorRef} className="relative">
					<Search
						className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
						strokeWidth={1.5}
					/>
					<input
						ref={inlineInputRef}
						type="search"
						name="q"
						placeholder="Search designers, pieces"
						value={c.query}
						onChange={(e) => {
							c.setQuery(e.target.value);
							setInlineOpen(true);
						}}
						onFocus={() => setInlineOpen(true)}
						onKeyDown={makeKeyHandler(
							c,
							inlinePanelOpen,
							() => setInlineOpen(false),
							() => goToSearch(c.query),
						)}
						role="combobox"
						aria-expanded={inlinePanelOpen}
						aria-controls={inlineListboxId}
						aria-autocomplete="list"
						aria-activedescendant={getActiveId(inlineListboxId, c, inlinePanelOpen)}
						autoComplete="off"
						className="h-10 w-52 rounded-full bg-secondary/70 pl-9 pr-3 text-[11px] uppercase tracking-[0.18em] text-foreground placeholder:text-muted-foreground/80 focus:bg-background focus:outline-none focus:ring-1 focus:ring-foreground/20"
					/>
				</div>
				<PopoverContent
					align="end"
					sideOffset={8}
					anchor={inlineAnchorRef}
					initialFocus={false}
					className="w-[min(22rem,calc(100vw-2rem))] rounded-2xl border-border bg-popover p-1.5 shadow-lg"
				>
					<Suggestions
						listboxId={inlineListboxId}
						open={inlinePanelOpen}
						c={c}
						onPick={goToProduct}
						onSeeAll={() => goToSearch(c.query)}
					/>
				</PopoverContent>
			</Popover>
		</form>
	);
}
