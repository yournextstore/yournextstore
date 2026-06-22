"use client";

import { Search } from "lucide-react";
import Link from "next/link";
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

export function SearchInput() {
	const searchParams = useSearchParams();
	const c = useSearchController(searchParams.get("q") ?? "");

	const [open, setOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const anchorRef = useRef<HTMLDivElement>(null);
	const listboxId = useId();

	const { goToSearch, goToProduct, handleSubmit } = makeNavHandlers(c, () => {
		setOpen(false);
		inputRef.current?.blur();
	});

	const panelOpen = open && c.enoughChars;

	return (
		<>
			{/* lg+ — inline bar on the flame header; below lg the icon opens the search page */}
			<form onSubmit={handleSubmit} className="hidden lg:block">
				<Popover open={panelOpen} onOpenChange={setOpen}>
					<div ref={anchorRef} className="relative">
						<Search
							className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[color:#fff8ec]/70"
							strokeWidth={1.75}
						/>
						<input
							ref={inputRef}
							type="search"
							name="q"
							placeholder="Search the cellar…"
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
							autoComplete="off"
							className="h-9 w-52 rounded-full border border-white/30 bg-white/10 pl-9 pr-3 text-sm text-[color:#fff8ec] placeholder:text-[color:#fff8ec]/60 focus:outline-none focus:ring-2 focus:ring-white/40"
						/>
					</div>
					<PopoverContent
						align="end"
						sideOffset={8}
						anchor={anchorRef}
						initialFocus={false}
						className="w-[min(22rem,calc(100vw-2rem))] rounded-2xl border-border bg-popover p-1.5 shadow-lg"
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

			{/* below lg — a plain link to the search page, styled for the flame header */}
			<Link
				href="/search"
				className="rounded-full p-2 text-[color:#fff8ec] transition-colors hover:bg-white/10 lg:hidden"
				aria-label="Search"
			>
				<Search className="h-5 w-5" strokeWidth={1.8} />
			</Link>
		</>
	);
}
