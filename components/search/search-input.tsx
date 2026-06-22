"use client";

import { Search, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Suggestions } from "@/components/search/suggestions";
import {
	getActiveId,
	makeKeyHandler,
	makeNavHandlers,
	useSearchController,
} from "@/components/search/use-search-controller";

// Theme search: an icon that opens a full-width overlay. Suggestions and keyboard handling come from the shared
// controller; only the chrome is the theme's.
export function SearchInput() {
	const searchParams = useSearchParams();
	const c = useSearchController(searchParams.get("q") ?? "");

	const [open, setOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const listboxId = useId();

	const close = () => {
		setOpen(false);
		inputRef.current?.blur();
	};
	const { goToSearch, goToProduct, handleSubmit } = makeNavHandlers(c, close);

	const panelOpen = open && c.enoughChars;

	useEffect(() => {
		if (open) inputRef.current?.focus();
	}, [open]);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="p-2 hover:bg-secondary rounded-full transition-colors"
				aria-label="Search"
			>
				<Search className="w-5 h-5" strokeWidth={1.4} />
			</button>
			{open && (
				<div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm animate-in fade-in duration-200">
					<div className="max-w-3xl mx-auto px-6 pt-32">
						<form onSubmit={handleSubmit}>
							<label htmlFor={`${listboxId}-input`} className="sr-only">
								Search products
							</label>
							<div className="flex items-center gap-3 border-b border-foreground pb-3">
								<Search className="w-5 h-5 text-foreground" strokeWidth={1.4} />
								<input
									ref={inputRef}
									id={`${listboxId}-input`}
									type="search"
									name="q"
									placeholder="Search the collection..."
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
									className="flex-1 bg-transparent text-2xl font-display tracking-wide outline-none placeholder:text-muted-foreground"
								/>
								<button
									type="button"
									onClick={close}
									aria-label="Close search"
									className="p-2 -mr-2 rounded-full hover:bg-secondary"
								>
									<X className="w-5 h-5" strokeWidth={1.4} />
								</button>
							</div>
						</form>
						{panelOpen ? (
							<div className="mt-4 border-t border-border pt-2">
								<Suggestions
									listboxId={listboxId}
									open={panelOpen}
									c={c}
									onPick={goToProduct}
									onSeeAll={() => goToSearch(c.query)}
								/>
							</div>
						) : (
							<p className="mt-4 text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
								Press enter to search · Esc to close
							</p>
						)}
					</div>
				</div>
			)}
		</>
	);
}
