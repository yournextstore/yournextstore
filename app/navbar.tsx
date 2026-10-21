"use client";

import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type NavLink = {
	href: string;
	label: string;
	children?: NavLink[];
};

/**
 * Sticky header surface. Solid surface at the top; once the page scrolls it turns translucent
 * with a blur and a soft shadow, as the original does past 50px.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 50);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<header
			className={cn(
				"site-header sticky top-0 z-50 border-b transition-[background-color,box-shadow,border-color] duration-300",
				scrolled
					? "border-border/50 bg-background/85 shadow-sm backdrop-blur-xl"
					: "border-border bg-surface",
			)}
		>
			{children}
		</header>
	);
}

const linkClass =
	"relative flex items-center gap-1 py-1 text-[13px] font-medium uppercase tracking-[0.08em] whitespace-nowrap text-foreground transition-colors hover:text-muted-foreground";

/** Desktop nav (lg+): uppercase tracked links; "Shop" opens the full-width mega menu on hover/focus. */
export function Navbar({ links }: { links: NavLink[] }) {
	// No usePathname here: it would take the header out of the prerendered shell. Links close
	// the panel on click instead.
	const [openMenu, setOpenMenu] = useState<string | null>(null);

	return (
		<nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
			{links.map((link) =>
				link.children && link.children.length > 0 ? (
					<div key={link.label} className="group/menu">
						<button
							type="button"
							aria-expanded={openMenu === link.label}
							onClick={() => setOpenMenu((open) => (open === link.label ? null : link.label))}
							className={linkClass}
						>
							{link.label}
							<ChevronDown
								aria-hidden="true"
								className="h-3.5 w-3.5 transition-transform duration-200 group-hover/menu:rotate-180"
								strokeWidth={2}
							/>
						</button>
						{/* Anchored to the header row (relative), not the button: full width, no overflow. */}
						<div
							className={cn(
								"absolute inset-x-0 top-full z-50 border-b border-border bg-surface shadow-[0_4px_24px_-4px_rgb(0_0_0/0.12)] transition-all duration-200",
								openMenu === link.label
									? "visible translate-y-0 opacity-100"
									: "invisible -translate-y-2 opacity-0 group-focus-within/menu:visible group-focus-within/menu:translate-y-0 group-focus-within/menu:opacity-100 group-hover/menu:visible group-hover/menu:translate-y-0 group-hover/menu:opacity-100",
							)}
						>
							<div className="px-6 py-8 lg:px-12">
								<ul className="grid grid-cols-3 gap-4 xl:grid-cols-4 2xl:grid-cols-6">
									{link.children.map((child) => (
										<li key={child.href}>
											<Link
												href={child.href}
												onClick={() => setOpenMenu(null)}
												className="block rounded-lg p-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
											>
												{child.label}
											</Link>
										</li>
									))}
								</ul>
								<div className="mt-6 border-t border-border pt-4">
									<Link
										href={link.href}
										onClick={() => setOpenMenu(null)}
										className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
									>
										View all
										<ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
									</Link>
								</div>
							</div>
						</div>
					</div>
				) : (
					<Link key={link.label} href={link.href} className={linkClass}>
						{link.label}
					</Link>
				),
			)}
		</nav>
	);
}

/** Mobile menu (below lg): the original's left drawer with full-width bordered rows. */
export function MobileMenu({ links, accountHref }: { links: NavLink[]; accountHref: string }) {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);
	const rowClass =
		"flex items-center justify-between border-b border-border px-6 py-4 text-lg font-medium text-foreground transition-colors hover:bg-secondary";

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button
					type="button"
					aria-label="Open menu"
					className="-ml-2 inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-secondary lg:hidden"
				>
					<Menu className="h-[22px] w-[22px]" strokeWidth={1.5} />
				</button>
			</SheetTrigger>
			<SheetContent
				side="left"
				className="block w-[88vw] max-w-sm gap-0 overflow-y-auto bg-surface p-0 [&>button]:hidden"
			>
				<div className="flex h-[72px] items-center justify-between border-b border-border px-6">
					<SheetTitle className="font-serif text-xl font-medium tracking-[0.12em] uppercase">Menu</SheetTitle>
					<SheetClose className="-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-secondary">
						<X className="h-5 w-5" strokeWidth={1.5} />
						<span className="sr-only">Close menu</span>
					</SheetClose>
				</div>
				<div className="border-b border-border px-6 py-4">
					<MobileSearchInput onNavigate={close} />
				</div>
				<nav aria-label="Mobile" className="flex flex-col">
					<Link href="/" onClick={close} className={rowClass}>
						Home
					</Link>
					{links.map((link) => (
						<div key={link.label}>
							<Link href={link.href} onClick={close} className={rowClass}>
								{link.children ? `${link.label} all` : link.label}
							</Link>
							{link.children?.map((child) => (
								<Link
									key={child.href}
									href={child.href}
									onClick={close}
									className="block border-b border-border py-3 pr-6 pl-10 text-base text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
								>
									{child.label}
								</Link>
							))}
						</div>
					))}
					<a href={accountHref} className={rowClass}>
						Account
					</a>
				</nav>
			</SheetContent>
		</Sheet>
	);
}
