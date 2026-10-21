"use client";

import Link from "next/link";
import { useState } from "react";
import { PaperToggle } from "@/components/paper-toggle";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { ThemeButton } from "@/components/theme-button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type NavLink = {
	href: string;
	label: string;
	/** Only from xl up: keeps the bar on one line at 1024. */
	wide?: boolean;
};

/** lg+: the original's quiet links, a soft pill on hover. */
export function DesktopNav({ links }: { links: NavLink[] }) {
	return (
		<nav aria-label="Main navigation" className="hidden items-center gap-0.5 lg:flex">
			{links.map((link) => (
				<Link key={link.href} href={link.href} className={cn("nav-link", link.wide && "hidden xl:inline")}>
					{link.label}
				</Link>
			))}
		</nav>
	);
}

/** Below lg: a sheet of paper drops from the top with the links, the ruling and the theme. */
export function MobileNav({ links, accountHref }: { links: NavLink[]; accountHref: string }) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button type="button" aria-label="Open menu" className="icon-btn lg:hidden">
					<svg
						viewBox="0 0 24 24"
						aria-hidden="true"
						className="size-[17px]"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.7"
						strokeLinecap="round"
					>
						<path d="M4 7h16M4 12h16M4 17h10" />
					</svg>
				</button>
			</SheetTrigger>
			<SheetContent
				side="top"
				className="paper block max-h-svh gap-0 overflow-y-auto rounded-b-2xl border-0 border-b border-line bg-sheet px-5 pb-7 pt-5 shadow-[var(--shadow)]"
			>
				<SheetTitle className="kicker">[ Menu ]</SheetTitle>
				<div className="mt-4">
					<MobileSearchInput onNavigate={() => setOpen(false)} />
				</div>
				<nav aria-label="Mobile navigation" className="mt-4 flex flex-col">
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							onClick={() => setOpen(false)}
							className="border-b border-line-2 py-2.5 font-display text-[1.5rem] leading-tight text-ink"
						>
							{link.label}
						</Link>
					))}
					<a
						href={accountHref}
						className="border-b border-line-2 py-2.5 font-display text-[1.5rem] leading-tight text-ink"
					>
						Account
					</a>
				</nav>
				<div className="mt-6 flex flex-wrap items-end justify-between gap-4">
					<PaperToggle label="The ruling" />
					<ThemeButton />
				</div>
			</SheetContent>
		</Sheet>
	);
}
