"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, Search } from "lucide-react";
import { useEffect, useId, useState } from "react";
import {
	getActiveId,
	makeKeyHandler,
	makeNavHandlers,
	useSearchController,
} from "@/components/search/use-search-controller";
import { cn } from "@/lib/utils";

/** Full-screen serif search on ⌘K and "/", as in the original. */
export function SearchOverlay({ suggestions }: { suggestions: string[] }) {
	const [open, setOpen] = useState(false);
	const c = useSearchController("");
	const listboxId = useId();
	const close = () => {
		setOpen(false);
		c.setQuery("");
	};
	const { goToSearch, goToProduct, handleSubmit } = makeNavHandlers(c, close);
	const panelOpen = open && c.enoughChars;

	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement | null;
			const typing = target
				? /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable
				: false;
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				setOpen(true);
			} else if (event.key === "/" && !typing) {
				event.preventDefault();
				setOpen(true);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	return (
		<Dialog.Root open={open} onOpenChange={(next) => (next ? setOpen(true) : close())}>
			<Dialog.Trigger className="order-2 flex min-h-8 flex-none cursor-pointer items-center gap-3 rounded-[2px] border border-rule px-2 py-[7px] text-[13px] text-dim transition hover:border-faint sm:order-none sm:min-w-[132px] sm:basis-[200px] sm:px-3">
				<Search aria-hidden className="size-[13px] sm:hidden" strokeWidth={1.8} />
				<span className="sr-only sm:not-sr-only sm:flex-1 sm:text-left">Search</span>
				<span aria-hidden className="hidden font-mono text-[11px] text-faint sm:inline">
					⌘K
				</span>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Content
					onOpenAutoFocus={(event) => {
						event.preventDefault();
						document.getElementById(`${listboxId}-input`)?.focus();
					}}
					className="fixed inset-0 z-50 flex justify-center overflow-y-auto bg-[oklch(0.97_0.002_0/0.97)] px-4 pb-6 pt-5 outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 sm:px-6 sm:pt-[12vh]"
				>
					<div className="flex w-[min(720px,100%)] flex-col gap-[26px]">
						<div className="flex items-baseline gap-4">
							<Dialog.Title className="eti font-normal text-faint">Search the archive</Dialog.Title>
							<Dialog.Description className="sr-only">
								Type a name, a material or a reference to find a piece.
							</Dialog.Description>
							<span className="flex-1" />
							<Dialog.Close className="min-h-6 cursor-pointer font-mono text-[12px] text-soft hover:text-acc">
								Close esc
							</Dialog.Close>
						</div>
						<form onSubmit={handleSubmit}>
							<input
								id={`${listboxId}-input`}
								type="search"
								name="q"
								value={c.query}
								onChange={(event) => c.setQuery(event.target.value)}
								onKeyDown={makeKeyHandler(c, panelOpen, close, () => goToSearch(c.query))}
								placeholder="Name, material or reference"
								aria-label="Search the archive"
								role="combobox"
								aria-expanded={panelOpen}
								aria-controls={listboxId}
								aria-autocomplete="list"
								aria-activedescendant={getActiveId(listboxId, c, panelOpen)}
								autoComplete="off"
								className="font-sf w-full rounded-none border-0 border-b border-acc bg-transparent px-0.5 py-3 text-[clamp(22px,4vw,30px)] text-ink outline-none placeholder:text-faint [&::-webkit-search-cancel-button]:hidden"
							/>
						</form>
						{suggestions.length > 0 ? (
							<div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
								{suggestions.map((suggestion) => (
									<button
										key={suggestion}
										type="button"
										onClick={() => c.setQuery(suggestion)}
										className="flex-none cursor-pointer whitespace-nowrap rounded-[2px] border border-rule px-3 py-[7px] text-[12.5px] text-soft transition hover:border-acc hover:text-acc"
									>
										{suggestion}
									</button>
								))}
							</div>
						) : null}
						{c.enoughChars ? (
							<div id={listboxId} role="listbox" aria-label="Pieces" className="flex flex-col">
								{c.suggestions.map((item, index) => (
									<button
										key={item.id}
										type="button"
										role="option"
										id={`${listboxId}-${item.id}`}
										aria-selected={c.highlight === index}
										onMouseEnter={() => c.setHighlight(index)}
										onClick={() => goToProduct(item.slug)}
										className={cn(
											"flex cursor-pointer flex-wrap items-baseline gap-x-5 gap-y-2 border-t border-line px-1 py-[15px] text-left transition hover:bg-card",
											c.highlight === index && "bg-card",
										)}
									>
										<span className="flex min-w-0 flex-[1_1_240px] flex-col gap-[5px]">
											<span className="font-sf text-[17px]">{item.name}</span>
											{item.summary ? (
												<span className="line-clamp-1 font-mono text-[10.5px] tracking-[0.06em] text-faint">
													{item.summary.startsWith(item.name)
														? item.summary.slice(item.name.length).trim()
														: item.summary}
												</span>
											) : null}
										</span>
										<span aria-hidden className="eti text-acc">
											Open
										</span>
									</button>
								))}
								{c.hasFetched && !c.hasResults && !c.isFetching ? (
									<div className="border-t border-line py-7 text-[14px] text-faint">
										Nothing found in the archive.
									</div>
								) : null}
								<button
									type="button"
									role="option"
									id={`${listboxId}-see-all`}
									aria-selected={c.highlight === c.seeAllIndex}
									onMouseEnter={() => c.setHighlight(c.seeAllIndex)}
									onClick={() => goToSearch(c.query)}
									className={cn(
										"eti flex cursor-pointer items-center gap-2 border-t border-line px-1 py-4 text-left text-soft hover:text-acc",
										c.highlight === c.seeAllIndex && "text-acc",
									)}
								>
									Every result for “{c.trimmed}” <ArrowRight aria-hidden className="size-3" />
								</button>
							</div>
						) : null}
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
