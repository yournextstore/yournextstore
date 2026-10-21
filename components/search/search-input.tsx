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

const fieldClass =
	"h-10 w-full rounded-sm border border-transparent bg-secondary pl-10 pr-3 text-label font-light text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:border-foreground";

/** Static stand-in with the field's exact box, so the bar doesn't move when the input streams in. */
export function SearchInputFallback() {
	return (
		<div className="relative w-full">
			<Search
				aria-hidden
				className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
				strokeWidth={1.75}
			/>
			<div className={`${fieldClass} flex items-center text-muted-foreground`}>Search product</div>
		</div>
	);
}

/** The original's search bar: a grey field at the end of the category bar, at every width. */
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
			<form onSubmit={handleSubmit}>
				<Popover open={panelOpen} onOpenChange={setOpen}>
					<PopoverAnchor asChild>
						<div className="relative">
							<label htmlFor={`${listboxId}-input`} className="sr-only">
								Search products
							</label>
							<Search
								aria-hidden
								className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
								strokeWidth={1.75}
							/>
							<input
								ref={inputRef}
								id={`${listboxId}-input`}
								type="search"
								name="q"
								placeholder="Search product"
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
						</div>
					</PopoverAnchor>
					<PopoverContent
						align="end"
						sideOffset={8}
						collisionPadding={16}
						onOpenAutoFocus={(e) => e.preventDefault()}
						onPointerDownOutside={() => setOpen(false)}
						className="w-[min(22rem,calc(100vw-2rem))] rounded-sm border-border bg-popover p-1.5 shadow-lg"
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
