"use client";

import { Search, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Suggestions } from "@/components/search/suggestions";
import {
	getActiveId,
	makeKeyHandler,
	makeNavHandlers,
	useSearchController,
} from "@/components/search/use-search-controller";

/** The original's search toggle: a chip that drops a centred search card under the header bar. */
export function HeaderSearch() {
	const [open, setOpen] = useState(false);
	const c = useSearchController("");
	const rootRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const listboxId = useId();

	const close = () => {
		setOpen(false);
		c.setQuery("");
	};
	const { goToSearch, goToProduct, handleSubmit } = makeNavHandlers(c, close);
	const panelOpen = open && c.enoughChars;

	useEffect(() => {
		if (!open) return;
		inputRef.current?.focus();
		const onPointerDown = (event: PointerEvent) => {
			if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
		};
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") setOpen(false);
		};
		document.addEventListener("pointerdown", onPointerDown);
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("pointerdown", onPointerDown);
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [open]);

	return (
		<div ref={rootRef}>
			<button
				type="button"
				className="chip-btn"
				aria-label={open ? "Close search" : "Search"}
				aria-expanded={open}
				onClick={() => setOpen((v) => !v)}
			>
				{open ? (
					<X className="size-7" strokeWidth={1.75} aria-hidden="true" />
				) : (
					<Search className="size-7" strokeWidth={1.75} aria-hidden="true" />
				)}
			</button>
			{open ? (
				<div className="absolute inset-x-0 top-full z-50 px-2 py-3 sm:px-4">
					<search className="mx-auto block w-full max-w-2xl">
						<form onSubmit={handleSubmit}>
							<label htmlFor={`${listboxId}-input`} className="sr-only">
								Search products
							</label>
							<div className="relative">
								<input
									ref={inputRef}
									id={`${listboxId}-input`}
									type="search"
									name="q"
									placeholder="Search"
									value={c.query}
									onChange={(e) => c.setQuery(e.target.value)}
									onKeyDown={makeKeyHandler(c, panelOpen, close, () => goToSearch(c.query))}
									role="combobox"
									aria-expanded={panelOpen}
									aria-controls={listboxId}
									aria-autocomplete="list"
									aria-activedescendant={getActiveId(listboxId, c, panelOpen)}
									enterKeyHint="search"
									autoComplete="off"
									className="w-full rounded-xl border border-border bg-background px-4 py-3 pe-10 text-sm text-foreground shadow-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-border [&::-webkit-search-cancel-button]:hidden"
								/>
								<Search
									className="pointer-events-none absolute inset-y-0 end-3 my-auto size-5 text-muted-foreground"
									aria-hidden="true"
								/>
							</div>
							<div className="mt-1 overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
								<div className="px-4 py-2 text-xs font-semibold text-muted-foreground">Products</div>
								{panelOpen ? (
									<div className="max-h-[min(20rem,55dvh)] overflow-y-auto overscroll-contain px-1.5 pb-1.5">
										<Suggestions
											listboxId={listboxId}
											open={panelOpen}
											c={c}
											onPick={goToProduct}
											onSeeAll={() => goToSearch(c.query)}
										/>
									</div>
								) : (
									<p className="px-4 pb-3 text-sm text-muted-foreground">Type to search the catalogue.</p>
								)}
							</div>
						</form>
					</search>
				</div>
			) : null}
		</div>
	);
}
