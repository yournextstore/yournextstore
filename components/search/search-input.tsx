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
		<>
			{/* xl+ — the inline 240px search field */}
			<form onSubmit={handleSubmit} className="hidden xl:block">
				<Popover open={inlinePanelOpen} onOpenChange={setInlineOpen}>
					<div ref={inlineAnchorRef} className="relative">
						<SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-neutral-500" />
						<input
							ref={inlineInputRef}
							type="search"
							name="q"
							placeholder="Search..."
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
							className="block h-[34px] w-[240px] rounded-md border border-field-border bg-field py-1.5 pr-2.5 pl-10 text-sm text-ink placeholder:text-neutral-500 focus:border-blue-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 [&::-webkit-search-cancel-button]:hidden"
						/>
					</div>
					<PopoverContent
						align="end"
						sideOffset={8}
						anchor={inlineAnchorRef}
						initialFocus={false}
						className="w-[min(22rem,calc(100vw-2rem))] rounded-md border-border bg-popover p-1.5 shadow-lg"
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
		</>
	);
}
