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

const placeholder = "Search products";

/** The original's header search: a grey pill that turns white on focus, suggestions below. */
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
		<form onSubmit={handleSubmit} className="search-form">
			<Popover open={inlinePanelOpen} onOpenChange={setInlineOpen}>
				<PopoverAnchor asChild>
					<div className="search-form-anchor">
						<Search size={18} strokeWidth={1.75} aria-hidden />
						<input
							ref={inlineInputRef}
							type="search"
							name="q"
							placeholder={placeholder}
							aria-label={placeholder}
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
						/>
					</div>
				</PopoverAnchor>
				<PopoverContent
					align="start"
					sideOffset={8}
					collisionPadding={16}
					onOpenAutoFocus={(e) => e.preventDefault()}
					onPointerDownOutside={() => setInlineOpen(false)}
					className="suggest-popover w-(--radix-popover-trigger-width) min-w-[min(22rem,calc(100vw-2rem))] rounded-3xl border-border bg-popover p-2 shadow-lg"
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

/** Same box as the live search, so the header does not shift when it hydrates. */
export function SearchInputFallback() {
	return (
		<div className="search-form" aria-hidden>
			<div className="search-form-anchor">
				<Search size={18} strokeWidth={1.75} aria-hidden />
				<input type="search" tabIndex={-1} placeholder={placeholder} readOnly />
			</div>
		</div>
	);
}
