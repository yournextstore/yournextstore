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
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const inputClass =
	"w-full rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 pr-10 text-base text-bone placeholder:text-[#8a9a9c] focus:border-amber/60 md:text-sm [&::-webkit-search-cancel-button]:hidden";

/** The reference's pill search with the glass on the right, plus live product suggestions. */
export function HeaderSearch({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
	const searchParams = useSearchParams();
	const c = useSearchController(searchParams.get("q") ?? "");
	const [open, setOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const listboxId = useId();

	const close = () => {
		setOpen(false);
		inputRef.current?.blur();
		onNavigate?.();
	};
	const { goToSearch, goToProduct, handleSubmit } = makeNavHandlers(c, close);
	const panelOpen = open && c.enoughChars;

	return (
		<search className={cn("relative w-full", className)}>
			<form onSubmit={handleSubmit}>
				<Popover open={panelOpen} onOpenChange={setOpen}>
					<PopoverAnchor asChild>
						<div className="relative">
							<label htmlFor={`${listboxId}-q`} className="sr-only">
								Search for products
							</label>
							<input
								ref={inputRef}
								id={`${listboxId}-q`}
								type="search"
								name="q"
								placeholder="Search the catalog…"
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
								enterKeyHint="search"
								autoComplete="off"
								className={inputClass}
							/>
							<div className="pointer-events-none absolute top-0 right-0 mr-3 flex h-full items-center">
								<Search className="h-4 w-4 text-[#8a9a9c]" aria-hidden="true" />
							</div>
						</div>
					</PopoverAnchor>
					<PopoverContent
						align="start"
						sideOffset={6}
						collisionPadding={16}
						onOpenAutoFocus={(e) => e.preventDefault()}
						onPointerDownOutside={() => setOpen(false)}
						className="w-(--radix-popover-trigger-width) min-w-72 overflow-hidden rounded-2xl border-white/10 bg-panel p-2 text-bone shadow-2xl"
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
		</search>
	);
}

export function HeaderSearchSkeleton({ className }: { className?: string }) {
	return (
		<div className={cn("relative w-full", className)}>
			<input aria-label="Search for products" placeholder="Search the catalog…" className={inputClass} />
			<div className="pointer-events-none absolute top-0 right-0 mr-3 flex h-full items-center">
				<Search className="h-4 w-4 text-[#8a9a9c]" aria-hidden="true" />
			</div>
		</div>
	);
}
