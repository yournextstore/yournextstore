"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Suggestions } from "@/components/search/suggestions";
import {
	getActiveId,
	makeKeyHandler,
	makeNavHandlers,
	useSearchController,
} from "@/components/search/use-search-controller";

function SearchIcon({ size = 19 }: { size?: number }) {
	return (
		<svg
			aria-hidden
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
		>
			<circle cx="11" cy="11" r="7" />
			<path d="m21 21-4.3-4.3" />
		</svg>
	);
}

/** Same footprint as the real button while the panel (which reads the URL) streams in. */
export function SearchButtonFallback() {
	return (
		<span className="rounded-md p-2.5" aria-hidden>
			<SearchIcon />
		</span>
	);
}

/** Header search: the icon drops a full-width panel under the header line, as in the original. */
export function SearchPanel() {
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
		if (!open) return;
		inputRef.current?.focus();
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open]);

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen((value) => !value)}
				aria-label="Search"
				aria-expanded={open}
				className="rounded-md p-2.5 transition hover:bg-current/10"
			>
				<SearchIcon />
			</button>
			{open && (
				<search className="absolute inset-x-0 top-full border-y border-border bg-background text-foreground shadow-lg">
					<div className="mx-auto max-w-6xl px-5 py-4">
						<form onSubmit={handleSubmit}>
							<label htmlFor={`${listboxId}-input`} className="sr-only">
								Search products
							</label>
							<div className="flex items-center gap-3 rounded-md border border-border px-4 focus-within:border-brass">
								<span className="shrink-0 text-muted-foreground">
									<SearchIcon size={17} />
								</span>
								<input
									ref={inputRef}
									id={`${listboxId}-input`}
									type="search"
									name="q"
									placeholder="Search the shop…"
									value={c.query}
									onChange={(e) => c.setQuery(e.target.value)}
									onKeyDown={makeKeyHandler(c, panelOpen, close, () => goToSearch(c.query))}
									role="combobox"
									aria-expanded={panelOpen}
									aria-controls={listboxId}
									aria-autocomplete="list"
									aria-activedescendant={getActiveId(listboxId, c, panelOpen)}
									autoComplete="off"
									className="w-full bg-transparent py-3 text-[15px] outline-none placeholder:text-muted-foreground"
								/>
								<kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground sm:block">
									Esc
								</kbd>
							</div>
						</form>
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
					</div>
				</search>
			)}
		</>
	);
}
