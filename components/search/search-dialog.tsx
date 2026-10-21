"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { Suggestions } from "@/components/search/suggestions";
import {
	getActiveId,
	makeKeyHandler,
	makeNavHandlers,
	useSearchController,
} from "@/components/search/use-search-controller";

type Chip = { href: string; label: string };

function SearchPanel({ chips, onClose }: { chips: Chip[]; onClose: () => void }) {
	const c = useSearchController("");
	const listboxId = useId();
	const { goToSearch, goToProduct, handleSubmit } = makeNavHandlers(c, onClose);
	const panelOpen = c.enoughChars;

	return (
		<form onSubmit={handleSubmit}>
			<div className="flex items-center gap-3 border-b px-5 py-4">
				<Search className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={1.5} aria-hidden="true" />
				<label htmlFor={`${listboxId}-input`} className="sr-only">
					Search products
				</label>
				<input
					id={`${listboxId}-input`}
					type="search"
					name="q"
					placeholder="Search products…"
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
					className="h-9 min-w-0 flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none [&::-webkit-search-cancel-button]:hidden"
				/>
				<kbd className="hidden rounded-sm border px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">
					ESC
				</kbd>
				<DialogPrimitive.Close
					className="-mr-1 flex h-9 w-9 shrink-0 items-center justify-center text-foreground transition-colors hover:text-muted-foreground"
					aria-label="Close search"
				>
					<X className="h-4 w-4" aria-hidden="true" />
				</DialogPrimitive.Close>
			</div>
			<div className="px-5 py-5">
				{panelOpen ? (
					<Suggestions
						listboxId={listboxId}
						open={panelOpen}
						c={c}
						onPick={goToProduct}
						onSeeAll={() => goToSearch(c.query)}
					/>
				) : chips.length > 0 ? (
					<>
						<p className="eyebrow text-muted-foreground">Suggested pieces</p>
						<ul className="mt-3 flex flex-wrap gap-2">
							{chips.map((chip) => (
								<li key={chip.href}>
									<Link
										href={chip.href}
										onClick={onClose}
										className="inline-flex min-h-9 items-center rounded-full border px-3.5 text-sm transition-colors hover:bg-muted"
									>
										{chip.label}
									</Link>
								</li>
							))}
						</ul>
					</>
				) : (
					<p className="text-sm text-muted-foreground">Type at least two letters to search.</p>
				)}
			</div>
		</form>
	);
}

/** Header search: an icon (with a ⌘K hint on wide screens) that opens a centred search panel. */
export function SearchDialog({ chips }: { chips: Chip[] }) {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setOpen(true);
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);

	return (
		<DialogPrimitive.Root open={open} onOpenChange={setOpen}>
			<DialogPrimitive.Trigger
				aria-label="Search"
				className="flex h-9 min-w-9 items-center justify-center gap-1.5 text-foreground transition-colors hover:text-muted-foreground"
			>
				<Search className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden="true" />
				<kbd className="hidden rounded-sm border px-1 py-0.5 text-[10px] text-muted-foreground xl:inline">
					⌘K
				</kbd>
			</DialogPrimitive.Trigger>
			<DialogPrimitive.Portal>
				<DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
				<DialogPrimitive.Content className="fixed top-[12vh] left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 border bg-popover text-popover-foreground shadow-xl data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 sm:top-[30vh] sm:rounded-lg">
					<DialogPrimitive.Title className="sr-only">Search the store</DialogPrimitive.Title>
					<DialogPrimitive.Description className="sr-only">
						Find a product by name, or jump to a category.
					</DialogPrimitive.Description>
					{open ? <SearchPanel chips={chips} onClose={() => setOpen(false)} /> : null}
				</DialogPrimitive.Content>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
}
