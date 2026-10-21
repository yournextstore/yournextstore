"use client";

import { ChevronRight, Contrast, Menu, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Seal } from "@/components/deckle";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type NavLink = {
	href: string;
	label: string;
};

const isCurrent = (pathname: string, href: string) =>
	pathname === href ||
	pathname.startsWith(`${href}/`) ||
	(href === "/products" && (pathname.startsWith("/product/") || pathname.startsWith("/category/"))) ||
	(href === "/collections" && pathname.startsWith("/collection/"));

/**
 * Marks the current section's link (`aria-current`) without reading the pathname in the header
 * itself, which would stream the header out of the prerendered shell. Renders nothing.
 */
export function NavCurrent() {
	const pathname = usePathname();
	useEffect(() => {
		for (const link of document.querySelectorAll<HTMLAnchorElement>("[data-site-nav] a")) {
			const href = link.getAttribute("href") ?? "";
			if (isCurrent(pathname, href)) {
				link.setAttribute("aria-current", "page");
			} else {
				link.removeAttribute("aria-current");
			}
		}
	}, [pathname]);
	return null;
}

export function Navbar({
	links,
	storeName,
	accountHref,
}: {
	links: NavLink[];
	storeName: string;
	accountHref: string;
}) {
	const [open, setOpen] = useState(false);
	const { resolvedTheme, setTheme } = useTheme();
	const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

	return (
		<>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<button
						type="button"
						aria-label="Open menu"
						className="-order-1 -ml-2.5 grid size-11 place-items-center rounded-full transition-colors hover:bg-secondary lg:hidden"
					>
						<Menu aria-hidden="true" className="size-6" strokeWidth={1.75} />
					</button>
				</SheetTrigger>
				<SheetContent
					side="left"
					showCloseButton={false}
					className="block w-full gap-0 overflow-y-auto border-0 bg-background p-0 sm:max-w-none"
				>
					<SheetTitle className="sr-only">Menu</SheetTitle>
					<div className="band-x flex min-h-16 items-center justify-between border-b border-border">
						<span className="inline-flex min-w-0 items-center gap-2.5 text-[0.9375rem] font-semibold uppercase leading-none tracking-[0.16em]">
							<Seal name={storeName} />
							<span className="truncate">{storeName}</span>
						</span>
						<SheetClose
							aria-label="Close the menu"
							className="-mr-2.5 grid size-11 place-items-center rounded-full transition-colors hover:bg-secondary"
						>
							<X aria-hidden="true" className="size-6" strokeWidth={1.75} />
						</SheetClose>
					</div>
					<div className="band-x grid content-start gap-8 py-6">
						<MobileSearchInput onNavigate={() => setOpen(false)} />
						<nav aria-label="Shop" data-site-nav>
							<ul className="grid">
								{links.map((link) => (
									<li key={link.href}>
										<Link
											href={link.href}
											onClick={() => setOpen(false)}
											className="flex items-center justify-between border-b border-border py-4 text-title-3 aria-[current=page]:text-copper-ink"
										>
											{link.label}
											<ChevronRight aria-hidden="true" className="size-4 text-muted-foreground" />
										</Link>
									</li>
								))}
							</ul>
						</nav>
						<ul className="grid gap-2">
							<li>
								{/* Plain <a>: /account is a proxied zone. */}
								<a href={accountHref} className="flex min-h-11 items-center gap-3 font-medium">
									<UserRound aria-hidden="true" className="size-5 text-muted-foreground" strokeWidth={1.75} />
									Account
								</a>
							</li>
							<li>
								<button
									type="button"
									onClick={toggleTheme}
									className="flex min-h-11 w-full items-center gap-3 text-left font-medium"
								>
									<Contrast aria-hidden="true" className="size-5 text-muted-foreground" strokeWidth={1.75} />
									Theme
								</button>
							</li>
						</ul>
					</div>
				</SheetContent>
			</Sheet>
			<nav aria-label="Shop" data-site-nav className="hidden lg:block">
				<ul className="flex gap-6">
					{links.map((link) => (
						<li key={link.href}>
							<Link
								href={link.href}
								className="relative block whitespace-nowrap py-2 text-[0.9375rem] font-medium text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-foreground aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-0 aria-[current=page]:after:-bottom-1 aria-[current=page]:after:h-0.5 aria-[current=page]:after:rounded-full aria-[current=page]:after:bg-copper"
							>
								{link.label}
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</>
	);
}
