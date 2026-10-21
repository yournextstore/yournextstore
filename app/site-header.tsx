"use client";

import { Search, X } from "lucide-react";
import { type ReactNode, useId, useRef, useState } from "react";
import { Suggestions } from "@/components/search/suggestions";
import {
	getActiveId,
	makeKeyHandler,
	makeNavHandlers,
	useSearchController,
} from "@/components/search/use-search-controller";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Three-slot bar (menu · wordmark · actions). The search button swaps the whole bar for a
 * full-width search field, the way the original storefront does: the bar slides down and fades,
 * the field drops in from above.
 */
export function SiteHeader({
	left,
	center,
	rightStart,
	rightEnd,
}: {
	left: ReactNode;
	center: ReactNode;
	rightStart?: ReactNode;
	rightEnd: ReactNode;
}) {
	const [searchOpen, setSearchOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);

	const closeSearch = () => {
		setSearchOpen(false);
		triggerRef.current?.focus();
	};

	return (
		<header className="sticky top-0 z-50 h-16 border-b border-border bg-background">
			<div
				className={cn(
					"absolute inset-0 transition-all duration-300 ease-in-out",
					searchOpen ? "pointer-events-none translate-y-4 opacity-0" : "translate-y-0 opacity-100",
				)}
			>
				<div className="shell h-full">
					<div className="flex h-full w-full items-center">
						<div className="flex flex-1 items-center">{left}</div>
						<div className="flex min-w-0 justify-center">{center}</div>
						<div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
							{rightStart}
							<Button
								ref={triggerRef}
								variant="ghost"
								size="icon-lg"
								onClick={() => setSearchOpen(true)}
								aria-label="Open search"
								aria-expanded={searchOpen}
								aria-controls="search-overlay"
							>
								<Search className="size-5" aria-hidden />
							</Button>
							{rightEnd}
						</div>
					</div>
				</div>
			</div>

			{searchOpen && (
				// biome-ignore lint/a11y/noStaticElementInteractions: click-outside scrim; Escape and the close button cover keyboards.
				// biome-ignore lint/a11y/useKeyWithClickEvents: see above.
				<div className="fixed inset-0 top-16 z-40" onClick={closeSearch} />
			)}

			<div
				id="search-overlay"
				inert={!searchOpen}
				className={cn(
					"absolute inset-x-0 top-0 z-50 transition-all duration-300 ease-in-out",
					searchOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-4 opacity-0",
				)}
			>
				{searchOpen ? <HeaderSearchField onClose={closeSearch} /> : <div className="h-16" />}
			</div>
		</header>
	);
}

function HeaderSearchField({ onClose }: { onClose: () => void }) {
	const c = useSearchController("");
	const listboxId = useId();
	const { goToSearch, goToProduct, handleSubmit } = makeNavHandlers(c, onClose);
	const panelOpen = c.enoughChars;

	return (
		<search className="bg-background">
			<div className="shell flex h-16 items-center gap-3">
				<form onSubmit={handleSubmit} className="flex-1">
					<label htmlFor={`${listboxId}-input`} className="sr-only">
						Search products
					</label>
					<div className="relative">
						<Search
							className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
							aria-hidden
						/>
						<input
							id={`${listboxId}-input`}
							type="search"
							name="q"
							// biome-ignore lint/a11y/noAutofocus: the field opens on an explicit "Open search" press.
							autoFocus
							placeholder="Search products..."
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
							className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-2 text-base text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-black focus-visible:ring-1 focus-visible:ring-black sm:text-sm"
						/>
					</div>
				</form>
				<Button variant="ghost" size="icon-lg" onClick={onClose} aria-label="Close search">
					<X className="size-5" aria-hidden />
				</Button>
			</div>
			{panelOpen ? (
				<div className="border-b border-border bg-background">
					<div className="shell pb-2">
						<Suggestions
							listboxId={listboxId}
							open={panelOpen}
							c={c}
							onPick={goToProduct}
							onSeeAll={() => goToSearch(c.query)}
						/>
					</div>
				</div>
			) : null}
		</search>
	);
}
