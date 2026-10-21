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
		<>
			{/* md+ — the original's wide pill search bar */}
			<form onSubmit={handleSubmit} className="hidden w-full md:block">
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
							className="h-[50px] w-full rounded-full border border-line bg-background pl-5 pr-14 text-lg text-foreground placeholder:text-hush focus:outline-none focus-visible:border-tangerine-bright [&::-webkit-search-cancel-button]:hidden"
						/>
						<button
							type="submit"
							aria-label="Search"
							className="absolute right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full text-ink transition-colors hover:text-tangerine"
						>
							<Search className="size-7" strokeWidth={2.25} />
						</button>
					</div>
					<PopoverContent
						align="end"
						sideOffset={8}
						anchor={inlineAnchorRef}
						initialFocus={false}
						className="w-(--anchor-width) min-w-[18rem] rounded-2xl border-border bg-popover p-1.5 shadow-lg"
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
