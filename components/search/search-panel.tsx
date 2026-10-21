"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
			strokeWidth="1.6"
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
		<span className="grid h-10 w-10 place-items-center border border-transparent" aria-hidden>
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
				className={`grid h-10 w-10 place-items-center border transition hover:border-current ${open ? "border-current" : "border-transparent"}`}
			>
				<SearchIcon />
			</button>
			{open &&
				createPortal(
					// The page dims and blurs behind the header while search is open (z-30 sits under it).
					<button
						type="button"
						tabIndex={-1}
						aria-hidden
						onClick={close}
						className="fixed inset-0 z-30 cursor-default bg-black/60 backdrop-blur-[5px]"
					/>,
					document.body,
				)}
			{open && (
				<search className="absolute inset-x-0 top-full max-h-[calc(100dvh-120px)] overflow-y-auto overscroll-contain border-t border-white/10 bg-black/90 text-white backdrop-blur-md">
					<div className="mx-auto max-w-4xl px-5 pt-10 pb-12">
						<form onSubmit={handleSubmit}>
							<label htmlFor={`${listboxId}-input`} className="sr-only">
								Search products
							</label>
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
								className="w-full border-b border-white bg-transparent pb-2 text-[clamp(22px,4vw,34px)] font-light tracking-[0.02em] outline-none placeholder:text-white/50"
							/>
							<p className="mt-3.5 flex justify-end text-[12px] uppercase tracking-[0.18em] text-white/70">
								Esc to close
							</p>
						</form>
						{panelOpen ? (
							<div className="mt-5">
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
