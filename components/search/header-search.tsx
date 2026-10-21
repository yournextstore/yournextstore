"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Suggestions } from "@/components/search/suggestions";
import {
	getActiveId,
	makeKeyHandler,
	makeNavHandlers,
	useSearchController,
} from "@/components/search/use-search-controller";
import { Popover, PopoverContent } from "@/components/ui/popover";

/** The header's full-width search field with live suggestions; ⌘K / Ctrl+K focuses it. */
export function HeaderSearch() {
	const c = useSearchController("");
	const [open, setOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const anchorRef = useRef<HTMLDivElement>(null);
	const listboxId = useId();

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				inputRef.current?.focus();
			}
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, []);

	const { goToSearch, goToProduct, handleSubmit } = makeNavHandlers(c, () => {
		setOpen(false);
		inputRef.current?.blur();
	});
	const panelOpen = open && c.enoughChars;

	return (
		<search className="w-full">
			<form onSubmit={handleSubmit}>
				<Popover open={panelOpen} onOpenChange={setOpen}>
					<div ref={anchorRef} className="relative">
						<label htmlFor={`${listboxId}-input`} className="sr-only">
							Search products
						</label>
						<input
							ref={inputRef}
							id={`${listboxId}-input`}
							type="search"
							name="q"
							placeholder="Search..."
							value={c.query}
							onChange={(e) => {
								c.setQuery(e.target.value);
								setOpen(true);
							}}
							onFocus={() => setOpen(true)}
							onKeyDown={makeKeyHandler(
								c,
								panelOpen,
								() => setOpen(false),
								() => goToSearch(c.query),
							)}
							role="combobox"
							aria-expanded={panelOpen}
							aria-controls={listboxId}
							aria-autocomplete="list"
							aria-activedescendant={getActiveId(listboxId, c, panelOpen)}
							autoComplete="off"
							className="h-10 w-full rounded-md border border-border bg-background px-4 pr-14 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-search-cancel-button]:hidden"
						/>
						<kbd
							aria-hidden
							className="pointer-events-none absolute right-3 top-1/2 inline-flex h-5 -translate-y-1/2 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground"
						>
							<span className="text-xs">⌘</span>K
						</kbd>
					</div>
					<PopoverContent
						align="start"
						sideOffset={8}
						anchor={anchorRef}
						initialFocus={false}
						className="w-(--anchor-width) min-w-[18rem] rounded-md p-1.5"
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
		</search>
	);
}
