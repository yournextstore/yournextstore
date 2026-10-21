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
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";

export function SearchInput() {
	const searchParams = useSearchParams();
	const c = useSearchController(searchParams.get("q") ?? "");

	const [inlineOpen, setInlineOpen] = useState(false);
	const inlineInputRef = useRef<HTMLInputElement>(null);
	const inlineListboxId = useId();

	const { goToSearch, goToProduct, handleSubmit } = makeNavHandlers(c, () => {
		setInlineOpen(false);
		inlineInputRef.current?.blur();
	});

	const inlinePanelOpen = inlineOpen && c.enoughChars;

	return (
		<>
			{/* xl+ — the original's wide grey search pill (phones and tablets get the header icon → /search) */}
			<form onSubmit={handleSubmit} className="hidden min-w-0 flex-1 xl:block">
				<Popover open={inlinePanelOpen} onOpenChange={setInlineOpen}>
					<PopoverAnchor asChild>
						<div className="relative">
							<Search
								className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-black/40"
								strokeWidth={2}
							/>
							<input
								ref={inlineInputRef}
								type="search"
								name="q"
								placeholder="Search for products..."
								aria-label="Search for products"
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
								className="h-12 w-full rounded-full border-0 bg-pill pl-[3.25rem] pr-4 text-base text-foreground transition-shadow placeholder:text-sm placeholder:text-muted-foreground focus:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
							/>
						</div>
					</PopoverAnchor>
					<PopoverContent
						align="end"
						sideOffset={8}
						collisionPadding={16}
						onOpenAutoFocus={(e) => e.preventDefault()}
						onPointerDownOutside={() => setInlineOpen(false)}
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
		</>
	);
}
