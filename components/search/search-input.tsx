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

	// The original's grey search pill, magnifier at the inline end.
	return (
		<form onSubmit={handleSubmit} className="w-36 xs:w-44 sm:w-[200px]">
			<Popover open={inlinePanelOpen} onOpenChange={setInlineOpen}>
				<div ref={inlineAnchorRef} className="relative">
					<Search
						className="pointer-events-none absolute right-2.5 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500"
						strokeWidth={1.75}
					/>
					<input
						ref={inlineInputRef}
						type="search"
						name="q"
						placeholder="Search"
						aria-label="Search products"
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
						className="h-10 w-full rounded-lg border border-transparent bg-neutral-100 py-2.5 pl-2.5 pr-9 text-base text-neutral-900 placeholder:text-neutral-500 transition-colors focus:border-violet-500 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
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
