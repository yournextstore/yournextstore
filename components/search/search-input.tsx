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
			{/* Desktop: an icon beside the links opens the search field; the mobile menu has its own. */}
			<Popover open={iconOpen} onOpenChange={setIconOpen}>
				<PopoverTrigger
					aria-label="Search"
					className="ml-2 hidden p-2 transition-colors hover:text-tangerine-ink sp-lg:inline-flex"
				>
					<Search className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
				</PopoverTrigger>
				<PopoverContent
					align="end"
					sideOffset={8}
					initialFocus={iconInputRef}
					className="w-[min(24rem,calc(100vw-2rem))] rounded-none border-2 border-ink bg-popover p-3 shadow-brut"
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
								aria-label="Search products"
								className="h-11 w-full border-2 border-ink bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
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
