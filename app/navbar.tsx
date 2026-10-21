"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type NavLink = {
	href: string;
	label: string;
};

const linkClass =
	"px-[15px] py-[10px] text-sal-nav transition-colors hover:bg-secondary hover:text-foreground whitespace-nowrap";

function isActive(pathname: string | null, href: string) {
	if (!pathname) return false;
	return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

type NavigationLike = {
	addEventListener: (type: string, fn: () => void) => void;
	removeEventListener: (type: string, fn: () => void) => void;
};

/**
 * Desktop links with the original's active state. `usePathname()` would take the header out of
 * the prerendered shell (and stays on its fallback on fully static pages), so the path is read
 * from the browser after hydration and on every client navigation.
 */
export function NavLinks({ links }: { links: NavLink[] }) {
	const [pathname, setPathname] = useState<string | null>(null);
	useEffect(() => {
		const update = () => setPathname(window.location.pathname);
		update();
		const nav: unknown = Reflect.get(window, "navigation");
		const navigation =
			nav && typeof nav === "object" && "addEventListener" in nav ? (nav as NavigationLike) : null;
		navigation?.addEventListener("navigatesuccess", update);
		window.addEventListener("popstate", update);
		return () => {
			navigation?.removeEventListener("navigatesuccess", update);
			window.removeEventListener("popstate", update);
		};
	}, []);
	return <NavLinksList links={links} pathname={pathname} />;
}

/** Same list without an active link: the prerendered fallback for `NavLinks`. */
export function NavLinksList({ links, pathname = null }: { links: NavLink[]; pathname?: string | null }) {
	return (
		<ul className="flex items-center">
			{links.map((link) => {
				const active = isActive(pathname, link.href);
				return (
					<li key={link.href}>
						<Link
							href={link.href}
							aria-current={active ? "page" : undefined}
							className={cn(linkClass, active ? "text-foreground" : "text-muted-foreground")}
						>
							{link.label}
						</Link>
					</li>
				);
			})}
		</ul>
	);
}

/** Mobile menu: the original has none below 800px, so the nav links open from a plain white panel. */
export function MobileMenu({ links, accountHref }: { links: NavLink[]; accountHref: string }) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				aria-label="Open menu"
				className="-mr-2 flex h-10 w-10 items-center justify-center text-foreground transition-colors hover:bg-secondary"
			>
				<Menu aria-hidden="true" className="h-5 w-5" strokeWidth={2.25} />
			</SheetTrigger>
			<SheetContent
				side="right"
				showCloseButton={false}
				className="max-w-sm gap-0 bg-white p-0 data-[side=right]:w-[85vw] data-[side=right]:border-l-0"
			>
				<div className="flex h-[50px] items-center justify-between border-b border-border px-3">
					<SheetTitle className="text-sal-sm font-bold uppercase tracking-wide">Menu</SheetTitle>
					<SheetDescription className="sr-only">Shop sections</SheetDescription>
					<SheetClose
						className="flex h-10 w-10 items-center justify-center hover:bg-secondary"
						aria-label="Close menu"
					>
						<X aria-hidden="true" className="h-5 w-5" />
					</SheetClose>
				</div>
				<nav className="flex flex-col p-3">
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							onClick={() => setOpen(false)}
							className="border-b border-secondary px-2 py-4 text-sal-base font-bold text-foreground transition-colors hover:bg-secondary"
						>
							{link.label}
						</Link>
					))}
				</nav>
				<div className="mt-auto flex gap-2 p-3">
					{/* Plain <a>: /account is a proxied zone. */}
					<a href={accountHref} className="sal-btn flex-1">
						Sign Up
					</a>
					<a href={accountHref} className="sal-btn sal-btn-muted flex-1">
						Sign In
					</a>
				</div>
			</SheetContent>
		</Sheet>
	);
}

/** Toggles the header's scrolled look (white bar + soft shadow) past 70px, like the original. */
export function HeaderScrollWatcher() {
	useEffect(() => {
		const header = document.querySelector<HTMLElement>("[data-site-header]");
		if (!header) return;
		const onScroll = () => {
			header.dataset.scrolled = window.scrollY >= 70 ? "true" : "false";
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return null;
}
