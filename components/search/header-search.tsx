"use client";

import { Search } from "lucide-react";
import { useId, useRef, useState } from "react";
import { Suggestions } from "@/components/search/suggestions";
import {
	getActiveId,
	makeKeyHandler,
	makeNavHandlers,
	useSearchController,
} from "@/components/search/use-search-controller";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";

/**
 * The original's header search: a white bar centred in the black header on desktop, a full-width
 * strip under it on phones. No useSearchParams, so it prerenders with the shell.
 */
export function HeaderSearch() {
	const c = useSearchController("");
	const [open, setOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const listboxId = useId();

	const { goToSearch, goToProduct, handleSubmit } = makeNavHandlers(c, () => {
		setOpen(false);
		inputRef.current?.blur();
	});
	const panelOpen = open && c.enoughChars;

	return (
		<search className="w-full">
			<form onSubmit={handleSubmit}>
				<Popover open={panelOpen} onOpenChange={setOpen}>
					<PopoverAnchor asChild>
						<div className="relative">
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
								enterKeyHint="search"
								autoComplete="off"
								className="h-11 w-full bg-white pl-4 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring lg:h-9 lg:rounded-sm lg:pl-3 [&::-webkit-search-cancel-button]:hidden"
							/>
							<button
								type="submit"
								aria-label="Search"
								className="absolute right-1 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground"
							>
								<Search aria-hidden className="size-5" strokeWidth={1.5} />
							</button>
						</div>
					</PopoverAnchor>
					<PopoverContent
						align="start"
						sideOffset={6}
						collisionPadding={16}
						onOpenAutoFocus={(e) => e.preventDefault()}
						onPointerDownOutside={() => setOpen(false)}
						className="w-(--radix-popover-trigger-width) min-w-[min(22rem,calc(100vw-2rem))] rounded-md border-border bg-popover p-1.5 shadow-lg"
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
