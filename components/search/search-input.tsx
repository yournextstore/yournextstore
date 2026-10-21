"use client";

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

	return (
		<>
			{/* minshop's editorial underline field; the header shows it from sm. */}
			<form onSubmit={handleSubmit}>
				<Popover open={inlinePanelOpen} onOpenChange={setInlineOpen}>
					<div ref={inlineAnchorRef} className="relative">
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
							className="h-8 w-40 border-0 border-b border-line bg-transparent px-1 text-sm text-foreground transition-all focus:w-56 focus:border-foreground focus:outline-none"
						/>
					</div>
					<PopoverContent
						align="end"
						sideOffset={8}
						anchor={inlineAnchorRef}
						initialFocus={false}
						className="w-[min(22rem,calc(100vw-2rem))] rounded-md border-line bg-popover p-1.5 shadow-lg"
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

/** Same box as the field, so the header row does not move when the input hydrates in. */
export function SearchInputFallback() {
	return <div aria-hidden="true" className="h-8 w-40 border-b border-line" />;
}
