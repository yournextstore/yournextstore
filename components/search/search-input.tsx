"use client";

import { useId, useRef, useState } from "react";
import { CloseIcon, SearchIcon } from "@/components/icons";
import { Suggestions } from "@/components/search/suggestions";
import {
	getActiveId,
	makeKeyHandler,
	makeNavHandlers,
	useSearchController,
} from "@/components/search/use-search-controller";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/**
 * Solace's header search: a round icon button that drops a bordered search panel below the
 * header. It starts empty instead of reading `?q=`, so the header needs no Suspense boundary
 * and the icon is part of the prerendered shell.
 */
export function SearchInput() {
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
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				aria-label="Search"
				className="inline-flex size-11 items-center justify-center rounded-full transition-colors hover:bg-tonal-hover/60 xs:size-12"
			>
				<SearchIcon className="size-5" />
			</PopoverTrigger>
			<PopoverContent
				align="end"
				sideOffset={16}
				collisionPadding={16}
				onOpenAutoFocus={(e) => {
					e.preventDefault();
					inputRef.current?.focus();
				}}
				className="w-[min(28.75rem,calc(100vw-2rem))] rounded-none border border-foreground bg-background p-0 shadow-none"
			>
				<search>
					<form onSubmit={handleSubmit}>
						<div className="flex items-center gap-2 border-b border-border px-5 py-3">
							<SearchIcon className="size-5 shrink-0" />
							<label htmlFor={`${listboxId}-input`} className="sr-only">
								Search products
							</label>
							<input
								ref={inputRef}
								id={`${listboxId}-input`}
								type="search"
								name="q"
								placeholder="Search"
								value={c.query}
								onChange={(e) => c.setQuery(e.target.value)}
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
								className="h-10 min-w-0 flex-1 bg-transparent text-lead [&::-webkit-search-cancel-button]:appearance-none text-foreground placeholder:text-muted-foreground focus:outline-none"
							/>
							<button
								type="button"
								onClick={() => setOpen(false)}
								aria-label="Close search"
								className="inline-flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-hover"
							>
								<CloseIcon className="size-5" />
							</button>
						</div>
					</form>
				</search>
				{panelOpen ? (
					<div className="p-2">
						<Suggestions
							listboxId={listboxId}
							open={panelOpen}
							c={c}
							onPick={goToProduct}
							onSeeAll={() => goToSearch(c.query)}
						/>
					</div>
				) : (
					<p className="px-5 py-4 text-copy text-muted-foreground">
						Type at least two letters to see products.
					</p>
				)}
			</PopoverContent>
		</Popover>
	);
}
