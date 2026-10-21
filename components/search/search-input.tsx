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

	return (
		<form onSubmit={handleSubmit} className="hidden min-w-0 flex-1 md:block">
			<Popover open={inlinePanelOpen} onOpenChange={setInlineOpen}>
				<div ref={inlineAnchorRef} className="relative">
					<Search
						className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
						strokeWidth={1.75}
					/>
					<input
						ref={inlineInputRef}
						type="search"
						name="q"
						placeholder="Find something you love and bring it home"
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
						aria-label="Search products"
						className="h-9 w-full rounded-full border border-input bg-transparent pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
					/>
				</div>
				<PopoverContent
					align="start"
					sideOffset={8}
					anchor={inlineAnchorRef}
					initialFocus={false}
					className="w-[min(32rem,calc(100vw-2rem))] rounded-sm border-border bg-popover p-1.5 shadow-lg"
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
