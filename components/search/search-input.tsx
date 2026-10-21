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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function SearchInput() {
	const searchParams = useSearchParams();
	const c = useSearchController(searchParams.get("q") ?? "");

	const [iconOpen, setIconOpen] = useState(false);
	const [inlineOpen, setInlineOpen] = useState(false);
	const iconInputRef = useRef<HTMLInputElement>(null);
	const inlineInputRef = useRef<HTMLInputElement>(null);
	const iconListboxId = useId();
	const _inlineListboxId = useId();

	const { goToSearch, goToProduct, handleSubmit } = makeNavHandlers(c, () => {
		setIconOpen(false);
		setInlineOpen(false);
		iconInputRef.current?.blur();
		inlineInputRef.current?.blur();
	});

	const iconPanelOpen = iconOpen && c.enoughChars;
	const _inlinePanelOpen = inlineOpen && c.enoughChars;

	return (
		<>
			{/* Below lg: an icon opens a popover with the input inside. */}
			<Popover open={iconOpen} onOpenChange={setIconOpen}>
				<PopoverTrigger
					aria-label="Search"
					className="hidden size-10 items-center justify-center rounded-[4px] text-dim transition-colors hover:text-cream sm:inline-flex"
				>
					<Search className="size-[18px]" strokeWidth={1.5} />
				</PopoverTrigger>
				<PopoverContent
					align="end"
					sideOffset={8}
					collisionPadding={16}
					onOpenAutoFocus={(e) => {
						e.preventDefault();
						iconInputRef.current?.focus();
					}}
					className="w-[min(24rem,calc(100vw-2rem))] rounded-[4px] border-border bg-popover p-2 shadow-lg"
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
								className="h-10 w-full rounded-[4px] border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
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
		</>
	);
}
