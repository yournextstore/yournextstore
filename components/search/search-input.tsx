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
import { Popover, PopoverContent } from "@/components/ui/popover";

const BAR = "relative flex h-11 items-center rounded-full border border-border bg-light/90 pl-4";
const INPUT =
	"h-full w-full min-w-0 bg-transparent pr-2 text-sm text-ink placeholder:text-soft-text focus:outline-none [&::-webkit-search-cancel-button]:hidden";
const SUBMIT =
	"m-1 flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-background transition-opacity hover:opacity-85";

/** Static twin of the bar for the Suspense fallback, so the header never shifts. */
export function SearchBarFallback() {
	return (
		<div className={BAR}>
			<span className="text-sm text-soft-text">Search for products</span>
			<span aria-hidden className={`${SUBMIT} ml-auto`}>
				<SearchIcon className="size-4" strokeWidth={2.5} />
			</span>
		</div>
	);
}

/** The original's full-width pill search with a black round submit button. */
export function SearchInput() {
	const searchParams = useSearchParams();
	const c = useSearchController(searchParams.get("q") ?? "");
	const [open, setOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const anchorRef = useRef<HTMLDivElement>(null);
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
					<div ref={anchorRef} className={BAR}>
						<label htmlFor={`${listboxId}-input`} className="sr-only">
							Search for products
						</label>
						<input
							ref={inputRef}
							id={`${listboxId}-input`}
							type="search"
							name="q"
							placeholder="Search for products"
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
							className={INPUT}
						/>
						<button type="submit" aria-label="Search" className={SUBMIT}>
							<SearchIcon aria-hidden className="size-4" strokeWidth={2.5} />
						</button>
					</div>
					<PopoverContent
						align="start"
						sideOffset={8}
						anchor={anchorRef}
						initialFocus={false}
						className="w-(--anchor-width) min-w-72 rounded-md border-border bg-popover p-1.5 shadow-lg"
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
