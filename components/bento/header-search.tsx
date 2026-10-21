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
import { cn } from "@/lib/utils";

const inputClass =
	"w-full rounded-lg border border-neutral-200 bg-white px-4 py-2 pr-10 text-base text-black placeholder:text-neutral-500 md:text-sm dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400 [&::-webkit-search-cancel-button]:hidden";

/** The reference's search field: a plain bordered input with the glass on the right, plus live suggestions. */
export function HeaderSearch({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
	const searchParams = useSearchParams();
	const c = useSearchController(searchParams.get("q") ?? "");
	const [open, setOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const anchorRef = useRef<HTMLDivElement>(null);
	const listboxId = useId();

	const close = () => {
		setOpen(false);
		inputRef.current?.blur();
		onNavigate?.();
	};
	const { goToSearch, goToProduct, handleSubmit } = makeNavHandlers(c, close);
	const panelOpen = open && c.enoughChars;

	return (
		<search className={cn("relative w-full max-w-[550px]", className)}>
			<form onSubmit={handleSubmit}>
				<Popover open={panelOpen} onOpenChange={setOpen}>
					<div ref={anchorRef} className="relative">
						<label htmlFor={`${listboxId}-q`} className="sr-only">
							Search for products
						</label>
						<input
							ref={inputRef}
							id={`${listboxId}-q`}
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
							enterKeyHint="search"
							autoComplete="off"
							className={inputClass}
						/>
						<div className="pointer-events-none absolute top-0 right-0 mr-3 flex h-full items-center">
							<Search className="h-4 w-4" aria-hidden="true" />
						</div>
					</div>
					<PopoverContent
						align="start"
						sideOffset={6}
						anchor={anchorRef}
						initialFocus={false}
						className="w-(--anchor-width) min-w-72 rounded-lg border-neutral-200 bg-white p-2 shadow-md dark:border-neutral-800 dark:bg-black"
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

export function HeaderSearchSkeleton({ className }: { className?: string }) {
	return (
		<div className={cn("relative w-full max-w-[550px]", className)}>
			<input aria-label="Search for products" placeholder="Search for products..." className={inputClass} />
			<div className="pointer-events-none absolute top-0 right-0 mr-3 flex h-full items-center">
				<Search className="h-4 w-4" aria-hidden="true" />
			</div>
		</div>
	);
}
