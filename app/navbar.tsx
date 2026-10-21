"use client";

import { ArrowLeft, ArrowRight, ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type NavLink = {
	href: string;
	label: string;
	/** Mega-menu columns: a heading and its links. */
	groups?: { title: string; links: { href: string; label: string }[] }[];
};

/** The original's grey topbar: one message at a time between two arrows, rotating every few seconds. */
export function Announcements({ messages }: { messages: string[] }) {
	const [index, setIndex] = useState(0);
	const count = messages.length;

	useEffect(() => {
		if (count < 2) return;
		const timer = window.setInterval(() => setIndex((i) => (i + 1) % count), 5000);
		return () => window.clearInterval(timer);
	}, [count]);

	const arrow =
		"inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xs text-on-topbar transition-opacity hover:opacity-70";

	return (
		<section aria-label="Announcements" className="bg-topbar text-on-topbar">
			<div className="shell flex h-11 items-center justify-center gap-4 md:h-14 md:gap-16">
				{count > 1 && (
					<button
						type="button"
						aria-label="Previous announcement"
						className={arrow}
						onClick={() => setIndex((i) => (i - 1 + count) % count)}
					>
						<ArrowLeft aria-hidden="true" className="h-5 w-5" strokeWidth={1.25} />
					</button>
				)}
				<p className="min-w-0 flex-1 truncate text-center text-[13px] tracking-[0.01em] uppercase md:max-w-md md:flex-none md:text-sm">
					{messages[index]}
				</p>
				{count > 1 && (
					<button
						type="button"
						aria-label="Next announcement"
						className={arrow}
						onClick={() => setIndex((i) => (i + 1) % count)}
					>
						<ArrowRight aria-hidden="true" className="h-5 w-5" strokeWidth={1.25} />
					</button>
				)}
			</div>
		</section>
	);
}

/** Sticky white header; once the page scrolls it picks up the original's soft header shadow. */
export function HeaderShell({ children }: { children: ReactNode }) {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 60);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<header
			className={cn(
				"sticky top-0 z-50 border-b border-border bg-background transition-shadow duration-300",
				scrolled && "shadow-[0_2px_5px_#0000000f]",
			)}
		>
			{children}
		</header>
	);
}

const linkClass =
	"relative flex h-full items-center gap-1 font-serif text-[15px] tracking-[0.01em] whitespace-nowrap text-foreground uppercase after:absolute after:inset-x-0 after:bottom-6 after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100";

/** Desktop nav (lg+): centred uppercase links; "Collections" opens a full-width mega menu. */
export function Navbar({ links }: { links: NavLink[] }) {
	// No usePathname here: it would take the header out of the prerendered shell. The panel
	// opens on hover/focus with CSS (biome rejects pointer handlers on a wrapper div) and on
	// click through state; links close it on click.
	const [openMenu, setOpenMenu] = useState<string | null>(null);

	return (
		<nav aria-label="Main" className="hidden h-full items-center gap-6 lg:flex xl:gap-8">
			{links.map((link) =>
				link.groups && link.groups.length > 0 ? (
					<div key={link.label} className="group/menu flex h-full items-center">
						<button
							type="button"
							aria-expanded={openMenu === link.label}
							onClick={() => setOpenMenu((open) => (open === link.label ? null : link.label))}
							className={linkClass}
						>
							{link.label}
							<ChevronDown
								aria-hidden="true"
								className="h-3.5 w-3.5 transition-transform group-hover/menu:rotate-180"
								strokeWidth={1.5}
							/>
						</button>
						{/* Anchored to the header row (relative), not the button: full width, no overflow. */}
						<div
							className={cn(
								"absolute inset-x-0 top-full z-50 border-t border-border bg-background shadow-[0_8px_16px_-8px_rgb(0_0_0/0.12)] transition-[opacity,visibility] duration-200",
								openMenu === link.label
									? "visible opacity-100"
									: "invisible opacity-0 group-focus-within/menu:visible group-focus-within/menu:opacity-100 group-hover/menu:visible group-hover/menu:opacity-100",
							)}
						>
							<div className="shell flex gap-16 py-10">
								{link.groups.map((group) => (
									<div key={group.title} className="min-w-44">
										<p className="text-xs font-medium tracking-[0.04em] text-muted-foreground uppercase">
											{group.title}
										</p>
										<ul className="mt-4 space-y-3">
											{group.links.map((child) => (
												<li key={child.href}>
													<Link
														href={child.href}
														onClick={() => setOpenMenu(null)}
														className="text-sm text-foreground transition-colors hover:text-muted-foreground"
													>
														{child.label}
													</Link>
												</li>
											))}
										</ul>
									</div>
								))}
								<div className="ml-auto self-end">
									<Link href={link.href} onClick={() => setOpenMenu(null)} className="link-reveal">
										Shop all
										<ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.25} />
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

/** Mobile menu (below lg): the original's grey left panel with uppercase rows and sub-menu chevrons. */
export function MobileMenu({ links, accountHref }: { links: NavLink[]; accountHref: string }) {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);
	const rowClass = "flex w-full items-center justify-between py-4 text-base tracking-[0.01em] uppercase";

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button
					type="button"
					aria-label="Open menu"
					className="-ml-2 inline-flex h-10 w-10 items-center justify-center rounded-xs lg:hidden"
				>
					<Menu className="h-[22px] w-[22px]" strokeWidth={1.25} />
				</button>
			</SheetTrigger>
			<SheetContent
				side="left"
				className="block w-[calc(100vw-1.25rem)] max-w-[360px] overflow-y-auto rounded-r-xl border-0 bg-muted p-0 [&>button]:hidden"
			>
				<div className="flex items-center justify-between px-5 pt-6 pb-4">
					<SheetTitle className="font-serif text-lg font-normal tracking-[0.01em] uppercase">Menu</SheetTitle>
					<SheetClose className="-mr-2 inline-flex h-10 w-10 items-center justify-center">
						<X className="h-5 w-5" strokeWidth={1.25} />
						<span className="sr-only">Close menu</span>
					</SheetClose>
				</div>
				<div className="px-5 pb-3">
					<MobileSearchInput onNavigate={close} />
				</div>
				<nav aria-label="Mobile" className="flex flex-col px-5 pb-10">
					{links.map((link) =>
						link.groups && link.groups.length > 0 ? (
							<details key={link.label} className="group">
								<summary
									className={cn(rowClass, "cursor-pointer list-none [&::-webkit-details-marker]:hidden")}
								>
									{link.label}
									<ChevronRight
										aria-hidden="true"
										className="h-5 w-5 transition-transform group-open:rotate-90"
										strokeWidth={1.25}
									/>
								</summary>
								<div className="space-y-5 pb-4 pl-3">
									{link.groups.map((group) => (
										<div key={group.title}>
											<p className="text-xs font-medium tracking-[0.04em] text-muted-foreground uppercase">
												{group.title}
											</p>
											<ul className="mt-2">
												{group.links.map((child) => (
													<li key={child.href}>
														<Link href={child.href} onClick={close} className="block py-2 text-[15px]">
															{child.label}
														</Link>
													</li>
												))}
											</ul>
										</div>
									))}
									<Link href={link.href} onClick={close} className="link-reveal">
										Shop all
									</Link>
								</div>
							</details>
						) : (
							<Link key={link.label} href={link.href} onClick={close} className={rowClass}>
								{link.label}
							</Link>
						),
					)}
					<a href={accountHref} className={rowClass}>
						Account
					</a>
				</nav>
			</SheetContent>
		</Sheet>
	);
}
