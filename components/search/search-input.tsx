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

const fieldClass =
	"h-10 w-full rounded-md border border-[#d1d5db] bg-card px-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground hover:border-[#9ca3af] focus:outline-none focus-visible:border-brand-display focus-visible:ring-2 focus-visible:ring-brand-display/40 dark:border-border";

/** Same box as the input, for the Suspense fallback (the input reads useSearchParams). */
export function SearchFallback() {
	return <div aria-hidden className={`${fieldClass} flex items-center text-muted-foreground`} />;
}

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
		<search className="w-full">
			<form onSubmit={handleSubmit} className="w-full">
				<label htmlFor={`${listboxId}-input`} className="sr-only">
					Search products
				</label>
				<Popover open={panelOpen} onOpenChange={setOpen}>
					<input
						ref={inputRef}
						id={`${listboxId}-input`}
						type="search"
						name="q"
						placeholder="Search products..."
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
						className={fieldClass}
					/>
					<PopoverContent
						align="start"
						sideOffset={8}
						anchor={inputRef}
						initialFocus={false}
						className="w-(--anchor-width) min-w-[min(22rem,calc(100vw-2rem))] rounded-xl border-border bg-popover p-1.5 shadow-lg"
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
