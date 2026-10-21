"use client";

import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Suggestions } from "@/components/search/suggestions";
import {
	getActiveId,
	makeKeyHandler,
	makeNavHandlers,
	useSearchController,
} from "@/components/search/use-search-controller";
import { Popover, PopoverContent } from "@/components/ui/popover";

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

	// "/" jumps to the search, as on the original, unless the shopper is already typing somewhere.
	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
			const target = event.target;
			if (
				target instanceof HTMLElement &&
				target.closest("input, textarea, select, [contenteditable='true']")
			) {
				return;
			}
			event.preventDefault();
			inlineInputRef.current?.focus();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	return (
		<search className="w-full max-w-[26rem]">
			<form onSubmit={handleSubmit}>
				<Popover open={inlinePanelOpen} onOpenChange={setInlineOpen}>
					<div ref={inlineAnchorRef} className="relative">
						<Search
							aria-hidden="true"
							className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
							strokeWidth={1.75}
						/>
						<input
							ref={inlineInputRef}
							type="search"
							name="q"
							aria-label="Search"
							placeholder="Search products, collections and more"
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
							className="peer h-11 w-full truncate rounded-full border-0 bg-secondary pl-11 pr-12 text-[0.9375rem] text-foreground placeholder:text-muted-foreground hover:shadow-[inset_0_0_0_1px_var(--input)] focus:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--ring)] [&::-webkit-search-cancel-button]:hidden"
						/>
						<kbd className="pointer-events-none absolute right-3 top-1/2 grid h-6 min-w-6 -translate-y-1/2 place-items-center rounded-md border border-input px-1.5 font-sans text-xs text-muted-foreground peer-focus:hidden">
							/
						</kbd>
					</div>
					<PopoverContent
						align="end"
						sideOffset={8}
						anchor={inlineAnchorRef}
						initialFocus={false}
						className="w-[min(26rem,calc(100vw-2rem))] rounded-frame border-border bg-popover p-1.5 shadow-lg"
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
		</search>
	);
}
