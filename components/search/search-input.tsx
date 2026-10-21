"use client";

import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useId, useRef, useState } from "react";
import { SearchIcon } from "@/components/icons";
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
			{/* Icon trigger opening a glass popover with the field inside, as the original header. */}
			<Popover open={iconOpen} onOpenChange={setIconOpen}>
				<PopoverTrigger
					aria-label="Search"
					className="hidden size-11 cursor-pointer items-center justify-center rounded-md text-ink/85 transition-colors hover:text-gold sm:inline-flex"
				>
					<SearchIcon />
				</PopoverTrigger>
				<PopoverContent
					align="end"
					sideOffset={8}
					collisionPadding={16}
					onOpenAutoFocus={(e) => {
						e.preventDefault();
						iconInputRef.current?.focus();
					}}
					className="w-[min(24rem,calc(100vw-2rem))] rounded-lg border-line bg-page/90 p-2 shadow-[0_24px_48px_-16px_rgb(0_0_0/0.7)] backdrop-blur-[10px]"
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
								className="h-11 w-full rounded-md border border-line bg-page pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
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
