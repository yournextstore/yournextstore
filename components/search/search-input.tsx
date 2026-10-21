"use client";

import { SearchIcon } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useId, useRef, useState } from "react";
import { Suggestions } from "@/components/search/suggestions";
import {
	getActiveId,
	makeKeyHandler,
	makeNavHandlers,
	useSearchController,
} from "@/components/search/use-search-controller";

const triggerClass =
	"inline-flex size-10 items-center justify-center text-muted-foreground transition-colors hover:bg-tile hover:text-ink";

export function SearchToggleFallback() {
	return (
		<button type="button" aria-label="Search" className={triggerClass}>
			<SearchIcon aria-hidden className="size-[19px]" strokeWidth={1.8} />
		</button>
	);
}

/**
 * The original's search: an icon in the header that drops a hairline panel under it with
 * one wide input and the results below.
 */
export function SearchToggle() {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const [lastPath, setLastPath] = useState(pathname);
	if (lastPath !== pathname) {
		setLastPath(pathname);
		setOpen(false);
	}

	return (
		<>
			<button
				type="button"
				aria-label="Search"
				aria-expanded={open}
				onClick={() => setOpen((value) => !value)}
				className={triggerClass}
			>
				<SearchIcon aria-hidden className="size-[19px]" strokeWidth={1.8} />
			</button>
			{open ? (
				<SearchPanel initialQuery={searchParams.get("q") ?? ""} onClose={() => setOpen(false)} />
			) : null}
		</>
	);
}

function SearchPanel({ initialQuery, onClose }: { initialQuery: string; onClose: () => void }) {
	const c = useSearchController(initialQuery);
	const inputRef = useRef<HTMLInputElement>(null);
	const listboxId = useId();
	const { goToSearch, goToProduct, handleSubmit } = makeNavHandlers(c, onClose);
	const panelOpen = c.enoughChars;

	return (
		<search className="absolute inset-x-0 top-full border-y border-line bg-paper shadow-sm">
			<form onSubmit={handleSubmit} className="mx-auto max-w-6xl px-5 py-4">
				<label htmlFor={`${listboxId}-input`} className="sr-only">
					Search the collection
				</label>
				<div className="flex items-center gap-3 border border-line px-4 focus-within:border-brand">
					<SearchIcon aria-hidden className="size-[17px] shrink-0 text-muted-foreground" strokeWidth={1.8} />
					<input
						ref={inputRef}
						id={`${listboxId}-input`}
						// biome-ignore lint/a11y/noAutofocus: the panel opens on an explicit click to search
						autoFocus
						type="search"
						name="q"
						placeholder="Search the collection…"
						value={c.query}
						onChange={(e) => c.setQuery(e.target.value)}
						onKeyDown={makeKeyHandler(c, panelOpen, onClose, () => goToSearch(c.query))}
						role="combobox"
						aria-expanded={panelOpen}
						aria-controls={listboxId}
						aria-autocomplete="list"
						aria-activedescendant={getActiveId(listboxId, c, panelOpen)}
						enterKeyHint="search"
						autoComplete="off"
						className="w-full bg-transparent py-3 text-body outline-none placeholder:text-muted-foreground"
					/>
					<kbd className="hidden border border-line px-1.5 py-0.5 text-[11px] text-muted-foreground sm:block">
						Esc
					</kbd>
				</div>
				{panelOpen ? (
					<div className="mt-3">
						<Suggestions
							listboxId={listboxId}
							open={panelOpen}
							c={c}
							onPick={goToProduct}
							onSeeAll={() => goToSearch(c.query)}
						/>
					</div>
				) : null}
			</form>
		</search>
	);
}
