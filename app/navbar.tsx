"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type NavLink = {
	href: string;
	label: string;
};

const isActive = (href: string, path: string | null) =>
	path !== null && (path === href || (href !== "/" && path.startsWith(href)));

// The header is part of the prerendered shell: `usePathname()` would stream it out (or fail
// the build on /blog/[slug]), so the active link is read from the location after hydration.
function useCurrentPath() {
	const [path, setPath] = useState<string | null>(null);
	useEffect(() => {
		const read = () => setPath(window.location.pathname);
		read();
		const nav = (window as Window & { navigation?: EventTarget }).navigation;
		nav?.addEventListener("navigatesuccess", read);
		window.addEventListener("popstate", read);
		return () => {
			nav?.removeEventListener("navigatesuccess", read);
			window.removeEventListener("popstate", read);
		};
	}, []);
	return path;
}

export function Navbar({ links }: { links: NavLink[] }) {
	const path = useCurrentPath();

	return (
		<nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
			{links.map((link) => {
				const active = isActive(link.href, path);
				return (
					<Link
						key={link.href}
						href={link.href}
						aria-current={active ? "page" : undefined}
						className={cn(
							"relative whitespace-nowrap pb-1 font-medium transition-colors",
							active ? "text-foreground" : "text-foreground/80 hover:text-brand",
						)}
					>
						{link.label}
						{active && (
							<span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-brand-display" />
						)}
					</Link>
				);
			})}
		</nav>
	);
}

export function MobileMenu({ links, accountHref }: { links: NavLink[]; accountHref: string }) {
	const [open, setOpen] = useState(false);
	const path = useCurrentPath();

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button
					type="button"
					aria-label="Open menu"
					className="inline-flex size-10 items-center justify-center rounded-lg transition-colors hover:bg-secondary lg:hidden"
				>
					<Menu className="size-6" strokeWidth={2} aria-hidden />
				</button>
			</SheetTrigger>
			<SheetContent side="right" hideClose className="w-80 max-w-[85vw] gap-0 bg-card p-0 sm:max-w-80">
				<div className="flex items-center justify-between border-b border-border p-4">
					<SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
					<SheetClose className="inline-flex size-10 items-center justify-center rounded-lg hover:bg-secondary">
						<X className="size-6" aria-hidden />
						<span className="sr-only">Close</span>
					</SheetClose>
				</div>
				<div className="border-b border-border p-4">
					{/* Plain <a>: /account is a proxied zone. */}
					<a
						href={accountHref}
						className="flex h-11 w-full items-center justify-center rounded-md bg-brand text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
					>
						Sign In
					</a>
				</div>
				<nav aria-label="Mobile" className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
					{links.map((link) => {
						const active = isActive(link.href, path);
						return (
							<Link
								key={link.href}
								href={link.href}
								onClick={() => setOpen(false)}
								aria-current={active ? "page" : undefined}
								className={cn(
									"rounded-lg px-4 py-3 text-base transition-colors",
									active ? "bg-brand-soft font-medium text-brand-soft-foreground" : "hover:bg-secondary",
								)}
							>
								{link.label}
							</Link>
						);
					})}
				</nav>
			</SheetContent>
		</Sheet>
	);
}
