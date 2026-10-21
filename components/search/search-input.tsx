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
			{/* Below lg: an icon opens a popover with the input inside. */}
			<Popover open={iconOpen} onOpenChange={setIconOpen}>
				<PopoverTrigger
					aria-label="Search"
					className="inline-flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:text-denim-deep xl:hidden"
				>
					<Search className="size-5" strokeWidth={1.75} />
				</PopoverTrigger>
				<PopoverContent
					align="end"
					sideOffset={8}
					collisionPadding={16}
					onOpenAutoFocus={(e) => {
						e.preventDefault();
						iconInputRef.current?.focus();
					}}
					className="w-[min(24rem,calc(100vw-2rem))] rounded-2xl border-border bg-popover p-2 shadow-lg"
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
								className="h-10 w-full rounded-full border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
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

			{/* lg+: the original's underlined search field in the header row. */}
			<form onSubmit={handleSubmit} className="hidden xl:block">
				<Popover open={inlinePanelOpen} onOpenChange={setInlineOpen}>
					<PopoverAnchor asChild>
						<div className="relative">
							<Search
								className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-ink"
								strokeWidth={2}
							/>
							<input
								ref={inlineInputRef}
								type="search"
								name="q"
								placeholder="Search the shop"
								aria-label="Search the shop"
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
								className="h-9 w-44 border-0 border-b-[1.5px] border-ink/30 bg-transparent pl-6 pr-1 text-[0.85rem] text-ink placeholder:text-faint focus:outline-none focus-visible:border-denim-deep"
							/>
						</div>
					</PopoverAnchor>
					<PopoverContent
						align="end"
						sideOffset={8}
						collisionPadding={16}
						onOpenAutoFocus={(e) => e.preventDefault()}
						onPointerDownOutside={() => setInlineOpen(false)}
						className="w-[min(22rem,calc(100vw-2rem))] rounded-2xl border-border bg-popover p-1.5 shadow-lg"
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
