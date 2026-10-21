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
	const iconInputRef = useRef<HTMLInputElement>(null);
	const iconListboxId = useId();

	const { goToSearch, goToProduct, handleSubmit } = makeNavHandlers(c, () => {
		setIconOpen(false);
		iconInputRef.current?.blur();
	});

	const iconPanelOpen = iconOpen && c.enoughChars;

	return (
		<>
			{/* lg+ — the original's search icon opens a popover with the input inside */}
			<Popover open={iconOpen} onOpenChange={setIconOpen}>
				<PopoverTrigger
					aria-label="Search"
					className="hidden rounded-lg p-1.5 transition-colors hover:bg-contrast-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime lg:inline-flex"
				>
					<Search className="size-5" strokeWidth={1} />
				</PopoverTrigger>
				<PopoverContent
					align="end"
					sideOffset={8}
					initialFocus={iconInputRef}
					className="w-[min(24rem,calc(100vw-2rem))] rounded-2xl border-0 bg-popover p-2 shadow-xl ring-1 ring-foreground/5"
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
								className="h-12 w-full rounded-xl border border-contrast-200 bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
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
