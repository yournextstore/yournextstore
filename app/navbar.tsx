"use client";

import { ChevronDown, UserRound } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useRef, useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { cn } from "@/lib/utils";

export type NavLink = {
	href: string;
	label: string;
};

type NavbarProps = {
	storeName: string;
	categories: NavLink[];
	pages: NavLink[];
	accountHref: string;
	search: ReactNode;
	cart: ReactNode;
};

const linkClass =
	"flex items-center gap-1 rounded-md px-2 py-2 text-sm font-semibold text-slate-ink transition-opacity hover:opacity-75";

/** The original's `.navbar`: brand left, bold dark links on the right, Bootstrap collapse below lg. */
export function Navbar({ storeName, categories, pages, accountHref, search, cart }: NavbarProps) {
	const [menuOpen, setMenuOpen] = useState(false);
	const [shopOpen, setShopOpen] = useState(false);
	const [mobileShopOpen, setMobileShopOpen] = useState(false);
	// A hover opens the dropdown first on touch and mouse alike; the click that follows must keep it.
	const hoverOpened = useRef(false);
	const close = () => {
		setMenuOpen(false);
		setShopOpen(false);
	};

	return (
		<nav aria-label="Main" className="container-ae">
			<div className="flex h-16 items-center gap-2">
				<Link href="/" onClick={close} className="min-w-0 truncate text-sm font-bold text-slate-ink">
					{storeName}
				</Link>

				<ul className="ml-auto hidden items-center gap-1 lg:flex">
					<li>
						<Link href="/products" className={linkClass}>
							Shop all
						</Link>
					</li>
					{categories.length > 0 && (
						<li
							className="relative"
							onMouseEnter={() => {
								hoverOpened.current = true;
								setShopOpen(true);
							}}
							onMouseLeave={() => {
								hoverOpened.current = false;
								setShopOpen(false);
							}}
						>
							<button
								type="button"
								aria-expanded={shopOpen}
								aria-controls="nav-categories"
								onClick={() => {
									if (hoverOpened.current) {
										hoverOpened.current = false;
										return;
									}
									setShopOpen((open) => !open);
								}}
								className={linkClass}
							>
								Categories
								<ChevronDown
									aria-hidden
									className={cn("h-3.5 w-3.5 transition-transform", shopOpen && "rotate-180")}
									strokeWidth={2.5}
								/>
							</button>
							{/* .dropdown-menu */}
							<div
								id="nav-categories"
								className={cn(
									"absolute left-0 top-full z-50 pt-2 transition-[opacity,transform] duration-150",
									shopOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
								)}
							>
								<ul className="min-w-52 rounded-lg border border-slate-line bg-white py-2 shadow-lg">
									{categories.map((category) => (
										<li key={category.href}>
											<Link
												href={category.href}
												onClick={close}
												className="block whitespace-nowrap px-4 py-2 text-sm text-slate-body transition-colors hover:bg-secondary hover:text-slate-ink"
											>
												{category.label}
											</Link>
										</li>
									))}
								</ul>
							</div>
						</li>
					)}
					{pages.slice(0, 1).map((page) => (
						<li key={page.href}>
							<Link href={page.href} className={linkClass}>
								{page.label}
							</Link>
						</li>
					))}
				</ul>

				<div className="ml-auto flex items-center gap-1 lg:ml-3">
					{search}
					{/* Plain <a>: /account is a proxied zone — soft navigation 500s (see AGENTS.md). */}
					<a
						href={accountHref}
						className="hidden rounded-md p-2 text-slate-ink transition-opacity hover:opacity-75 sm:inline-flex"
						aria-label="Account"
					>
						<UserRound className="h-5 w-5" strokeWidth={2} />
					</a>
					{cart}
					{/* .navbar-toggler: a bordered box with three bars that turn into an X. */}
					<button
						type="button"
						aria-label={menuOpen ? "Close menu" : "Open menu"}
						aria-expanded={menuOpen}
						aria-controls="mobile-navigation"
						onClick={() => setMenuOpen((open) => !open)}
						className="ml-1 flex h-10 w-12 flex-col items-center justify-center gap-[5px] rounded-md border border-slate-line lg:hidden"
					>
						<span
							className={cn(
								"block h-0.5 w-5 rounded bg-slate-body transition-transform",
								menuOpen && "translate-y-[7px] rotate-45",
							)}
						/>
						<span className={cn("block h-0.5 w-5 rounded bg-slate-body", menuOpen && "opacity-0")} />
						<span
							className={cn(
								"block h-0.5 w-5 rounded bg-slate-body transition-transform",
								menuOpen && "-translate-y-[7px] -rotate-45",
							)}
						/>
					</button>
				</div>
			</div>

			{/* .navbar-collapse: drops open under the bar, pushing the page down. */}
			<div id="mobile-navigation" hidden={!menuOpen} className="pb-5 lg:hidden">
				<div className="pb-3">
					<MobileSearchInput onNavigate={close} />
				</div>
				<ul className="flex flex-col">
					<li>
						<Link href="/products" onClick={close} className={cn(linkClass, "px-4 py-2.5 text-base")}>
							Shop all
						</Link>
					</li>
					{categories.length > 0 && (
						<li>
							<button
								type="button"
								aria-expanded={mobileShopOpen}
								aria-controls="mobile-categories"
								onClick={() => setMobileShopOpen((open) => !open)}
								className={cn(linkClass, "px-4 py-2.5 text-base")}
							>
								Categories
								<ChevronDown
									aria-hidden
									className={cn("h-4 w-4 transition-transform", mobileShopOpen && "rotate-180")}
									strokeWidth={2.5}
								/>
							</button>
							<ul
								id="mobile-categories"
								hidden={!mobileShopOpen}
								className="mb-1 ml-4 border-l border-slate-line"
							>
								{categories.map((category) => (
									<li key={category.href}>
										<Link
											href={category.href}
											onClick={close}
											className="block px-4 py-2 text-[0.9375rem] text-slate-body hover:text-slate-ink"
										>
											{category.label}
										</Link>
									</li>
								))}
							</ul>
						</li>
					)}
					{pages.map((page) => (
						<li key={page.href}>
							<Link href={page.href} onClick={close} className={cn(linkClass, "px-4 py-2.5 text-base")}>
								{page.label}
							</Link>
						</li>
					))}
					<li>
						<a href={accountHref} className={cn(linkClass, "px-4 py-2.5 text-base")}>
							Account
						</a>
					</li>
				</ul>
			</div>
		</nav>
	);
}
