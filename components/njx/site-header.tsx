"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { CartButton } from "@/app/cart-button";
import { BrandMark } from "@/components/njx/brand-mark";
import { AccountIcon, SearchIcon } from "@/components/njx/icons";
import { MenuDrawer, type MenuLinks } from "@/components/njx/menu-drawer";
import { ThemeSwitch } from "@/components/njx/theme-switch";
import { Suggestions } from "@/components/search/suggestions";
import {
	getActiveId,
	makeKeyHandler,
	makeNavHandlers,
	useSearchController,
} from "@/components/search/use-search-controller";

export type NavLink = { href: string; label: string };

/**
 * Marks the link for the current page with aria-current. Done from the DOM rather than
 * usePathname(), which would stream the header out of the prerendered shell.
 */
function useActiveLinks(_rootRef: React.RefObject<HTMLElement | null>) {
	useEffect(() => {
		const sync = () => {
			const path = window.location.pathname.replace(/\/$/, "") || "/";
			for (const link of document.querySelectorAll<HTMLAnchorElement>("a[data-nav-link]")) {
				const href = link.getAttribute("href") ?? "";
				const active = href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`);
				if (active) link.setAttribute("aria-current", "page");
				else link.removeAttribute("aria-current");
			}
		};
		sync();
		const main = document.querySelector("main");
		const observer = new MutationObserver(sync);
		if (main) observer.observe(main, { childList: true, subtree: true });
		// Drawers portal into <body> when they open.
		observer.observe(document.body, { childList: true });
		window.addEventListener("popstate", sync);
		return () => {
			observer.disconnect();
			window.removeEventListener("popstate", sync);
		};
	}, []);
}

export function SiteHeader({
	storeName,
	letter,
	links,
	menu,
	accountHref,
}: {
	storeName: string;
	letter: string;
	links: NavLink[];
	menu: MenuLinks;
	accountHref: string;
}) {
	const rootRef = useRef<HTMLElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const listboxId = useId();
	const [searchOpen, setSearchOpen] = useState(false);
	const c = useSearchController("");
	useActiveLinks(rootRef);

	const closeSearch = () => {
		setSearchOpen(false);
		inputRef.current?.blur();
	};
	const { goToSearch, goToProduct, handleSubmit } = makeNavHandlers(c, () => {
		closeSearch();
		c.setQuery("");
	});
	const panelOpen = searchOpen && c.enoughChars;

	// "/" opens search from anywhere, as in the original.
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement | null;
			const typing = target?.closest("input, textarea, select, [contenteditable=true]");
			if (e.key === "/" && !typing) {
				e.preventDefault();
				setSearchOpen(true);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	useEffect(() => {
		if (searchOpen) inputRef.current?.focus();
	}, [searchOpen]);

	return (
		<header ref={rootRef} className="sticky top-2 z-40 mx-auto w-full max-w-6xl px-3 sm:top-3 sm:px-5">
			<div className="overflow-hidden rounded-2xl border border-line bg-paper/90 shadow-sm backdrop-blur">
				<nav aria-label="Main" className="flex h-14 items-center justify-between gap-2 px-3 sm:h-16 sm:px-5">
					<div className="flex min-w-0 items-center gap-3">
						<Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-2.5">
							<BrandMark letter={letter} />
							<span className="truncate font-display text-[18px] font-bold tracking-tight sm:text-[21px]">
								{storeName}
							</span>
						</Link>
						<ThemeSwitch className="hidden sm:block" />
					</div>

					<div className="hidden items-center gap-1 text-[15px] text-muted-foreground lg:flex">
						{links.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								data-nav-link
								className="whitespace-nowrap rounded-md px-3 py-2 hover:bg-tile hover:text-ink aria-[current=page]:bg-tile aria-[current=page]:text-ink"
							>
								{link.label}
							</Link>
						))}
					</div>

					<div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
						<button
							type="button"
							onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
							className="rounded-md p-2 text-muted-foreground hover:bg-tile hover:text-ink sm:p-2.5"
							aria-label="Search"
							aria-expanded={searchOpen}
						>
							<SearchIcon />
						</button>
						{/* Plain <a>: /account is a proxied zone, a soft navigation 500s. */}
						<a
							href={accountHref}
							className="hidden rounded-md p-2.5 text-muted-foreground hover:bg-tile hover:text-ink sm:block"
							aria-label="Account"
						>
							<AccountIcon />
						</a>
						<CartButton />
						<MenuDrawer storeName={storeName} letter={letter} links={menu} accountHref={accountHref} />
					</div>
				</nav>

				{searchOpen ? (
					<div className="border-t border-line bg-paper">
						<div className="px-3 py-4 sm:px-5">
							<search>
								<form onSubmit={handleSubmit}>
									<div className="flex items-center gap-3 rounded-md border border-line px-4 focus-within:border-pine">
										<SearchIcon size={17} className="shrink-0 text-muted-foreground" />
										<label htmlFor={`${listboxId}-input`} className="sr-only">
											Search products
										</label>
										<input
											ref={inputRef}
											id={`${listboxId}-input`}
											type="search"
											name="q"
											placeholder="Search products…"
											value={c.query}
											onChange={(e) => c.setQuery(e.target.value)}
											onKeyDown={makeKeyHandler(c, panelOpen, closeSearch, () => goToSearch(c.query))}
											role="combobox"
											aria-expanded={panelOpen}
											aria-controls={listboxId}
											aria-autocomplete="list"
											aria-activedescendant={getActiveId(listboxId, c, panelOpen)}
											enterKeyHint="search"
											autoComplete="off"
											className="w-full bg-transparent py-3 text-[15px] outline-none placeholder:text-muted-foreground"
										/>
										<kbd className="hidden rounded border border-line px-1.5 py-0.5 text-[11px] text-muted-foreground sm:block">
											Esc
										</kbd>
									</div>
								</form>
							</search>
							{panelOpen ? (
								<div className="mt-2">
									<Suggestions
										listboxId={listboxId}
										open={panelOpen}
										c={c}
										onPick={goToProduct}
										onSeeAll={() => goToSearch(c.query)}
									/>
								</div>
							) : (
								<p className="pt-3 text-[13px] text-muted-foreground">
									Type at least two letters to see matching products.
								</p>
							)}
						</div>
					</div>
				) : null}
			</div>
		</header>
	);
}
