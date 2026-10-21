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
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function SearchInput() {
	const searchParams = useSearchParams();
	const c = useSearchController(searchParams.get("q") ?? "");

	const [iconOpen, setIconOpen] = useState(false);
	const [inlineOpen, setInlineOpen] = useState(false);
	const iconInputRef = useRef<HTMLInputElement>(null);
	const inlineInputRef = useRef<HTMLInputElement>(null);
	const iconListboxId = useId();
	const inlineListboxId = useId();

	const { goToSearch, goToProduct, handleSubmit } = makeNavHandlers(c, () => {
		setIconOpen(false);
		setInlineOpen(false);
		iconInputRef.current?.blur();
		inlineInputRef.current?.blur();
	});

	const iconPanelOpen = iconOpen && c.enoughChars;
	const inlinePanelOpen = inlineOpen && c.enoughChars;

	return (
		<>
			{/* Phones: an outline icon button opens a popover with the input inside */}
			<Popover open={iconOpen} onOpenChange={setIconOpen}>
				<PopoverTrigger
					aria-label="Search"
					className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-background shadow-xs transition-colors hover:bg-accent sm:hidden dark:bg-input/30"
				>
					<Search className="h-4 w-4" aria-hidden />
				</PopoverTrigger>
				<PopoverContent
					align="end"
					sideOffset={8}
					collisionPadding={16}
					onOpenAutoFocus={(e) => {
						e.preventDefault();
						iconInputRef.current?.focus();
					}}
					className="w-[min(24rem,calc(100vw-2rem))] rounded-md border-border bg-popover p-2 shadow-md"
				>
					<form onSubmit={handleSubmit}>
						<div className="relative">
							<Search
								className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
								strokeWidth={1.75}
							/>
							<input
								ref={iconInputRef}
								type="search"
								name="q"
								placeholder="Search products"
								value={c.query}
								onChange={(e) => c.setQuery(e.target.value)}
								onKeyDown={makeKeyHandler(
									c,
									iconPanelOpen,
									() => setIconOpen(false),
									() => goToSearch(c.query),
								)}
								role="combobox"
								aria-expanded={iconPanelOpen}
								aria-controls={iconListboxId}
								aria-autocomplete="list"
								aria-activedescendant={getActiveId(iconListboxId, c, iconPanelOpen)}
								autoComplete="off"
								className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
							/>
						</div>
					</form>
					{iconPanelOpen ? (
						<div className="mt-2">
							<Suggestions
								listboxId={iconListboxId}
								open={iconPanelOpen}
								c={c}
								onPick={goToProduct}
								onSeeAll={() => goToSearch(c.query)}
							/>
						</div>
					) : null}
				</PopoverContent>
			</Popover>

			{/* sm+ — the original's outline "Search..." field */}
			<form onSubmit={handleSubmit} className="hidden sm:block">
				<Popover open={inlinePanelOpen} onOpenChange={setInlineOpen}>
					<PopoverAnchor asChild>
						<div className="relative">
							<input
								ref={inlineInputRef}
								type="search"
								name="q"
								placeholder="Search..."
								aria-label="Search products"
								value={c.query}
								onChange={(e) => {
									c.setQuery(e.target.value);
									setInlineOpen(true);
								}}
								onFocus={() => setInlineOpen(true)}
								onKeyDown={makeKeyHandler(
									c,
									inlinePanelOpen,
									() => setInlineOpen(false),
									() => goToSearch(c.query),
								)}
								role="combobox"
								aria-expanded={inlinePanelOpen}
								aria-controls={inlineListboxId}
								aria-autocomplete="list"
								aria-activedescendant={getActiveId(inlineListboxId, c, inlinePanelOpen)}
								autoComplete="off"
								className="h-9 w-32 rounded-md border border-input bg-background px-3 text-sm font-light text-foreground shadow-xs placeholder:text-muted-foreground focus:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:w-40 lg:w-64 dark:bg-input/30"
							/>
						</div>
					</PopoverAnchor>
					<PopoverContent
						align="end"
						sideOffset={8}
						collisionPadding={16}
						onOpenAutoFocus={(e) => e.preventDefault()}
						onPointerDownOutside={() => setInlineOpen(false)}
						className="w-[min(22rem,calc(100vw-2rem))] rounded-md border-border bg-popover p-1.5 shadow-md"
					>
						<Suggestions
							listboxId={inlineListboxId}
							open={inlinePanelOpen}
							c={c}
							onPick={goToProduct}
							onSeeAll={() => goToSearch(c.query)}
						/>
					</PopoverContent>
				</Popover>
			</form>
		</>
	);
}
