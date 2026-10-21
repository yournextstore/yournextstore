"use client";

import { SearchIcon } from "lucide-react";
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

/** The original's centred header search: a bordered field with an attached search button. */
export function SearchInput() {
	const searchParams = useSearchParams();
	const c = useSearchController(searchParams.get("q") ?? "");
	const [open, setOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const listboxId = useId();

	const { goToSearch, goToProduct, handleSubmit } = makeNavHandlers(c, () => {
		setOpen(false);
		inputRef.current?.blur();
	});

	const panelOpen = open && c.enoughChars;

	return (
		<search>
			<form onSubmit={handleSubmit}>
				<Popover open={panelOpen} onOpenChange={setOpen}>
					<PopoverAnchor asChild>
						<div className="flex h-10 w-full overflow-hidden rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring/40">
							<label htmlFor={`${listboxId}-input`} className="sr-only">
								Search for products
							</label>
							<input
								ref={inputRef}
								id={`${listboxId}-input`}
								type="search"
								name="q"
								placeholder="Search for products..."
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
								className="min-w-0 flex-1 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
							/>
							<button
								type="submit"
								aria-label="Search"
								className="inline-flex w-10 shrink-0 items-center justify-center border-l border-input transition-colors hover:bg-accent"
							>
								<SearchIcon className="size-4" />
							</button>
						</div>
					</PopoverAnchor>
					<PopoverContent
						align="start"
						sideOffset={6}
						collisionPadding={16}
						onOpenAutoFocus={(e) => e.preventDefault()}
						onPointerDownOutside={() => setOpen(false)}
						className="w-(--radix-popover-trigger-width) min-w-80 rounded-md border-border bg-popover p-1.5 shadow-lg"
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
