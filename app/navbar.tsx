"use client";

import Link from "next/link";
import { useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type NavLink = {
	href: string;
	label: string;
};

/** Desktop: the original's letter-spaced caps links, a brass underline growing on hover. */
export function DesktopNav({ links }: { links: NavLink[] }) {
	return (
		<nav aria-label="Main navigation" className="hidden items-center lg:flex">
			{links.map((link) => (
				<Link
					key={link.href}
					href={link.href}
					className="nav-underline caps whitespace-nowrap px-3 py-2 text-[0.875rem] text-ink transition-colors duration-150 [--u-bottom:0px] [--u-inset:0.75rem] hover:text-gold xl:px-4 xl:[--u-inset:1rem]"
				>
					{link.label}
				</Link>
			))}
		</nav>
	);
}

/**
 * Below lg: the original's square brass toggle (☰, filled when open) dropping a full-width panel of
 * caps rows under the bar, each separated by a faint brass rule.
 */
export function MobileNav({ links }: { links: NavLink[] }) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet
			open={open}
			onOpenChange={(next, details) => {
				// The toggle sits outside the panel; let its own click close the menu.
				if (
					!next &&
					details.reason === "outside-press" &&
					(details.event.target as HTMLElement | null)?.closest("[data-site-header]")
				) {
					details.cancel();
					return;
				}
				setOpen(next);
			}}
			modal={false}
		>
			<SheetTrigger
				aria-label={open ? "Close menu" : "Open menu"}
				className="ml-1 inline-flex size-10 items-center justify-center rounded-[2px] border border-gold text-[1.25rem] leading-none text-gold transition-colors hover:border-cream hover:bg-panel hover:text-cream data-popup-open:bg-gold data-popup-open:text-on-gold lg:hidden"
			>
				<span aria-hidden="true">☰</span>
			</SheetTrigger>
			<SheetContent
				side="top"
				showCloseButton={false}
				showOverlay={false}
				className="block data-[side=top]:top-[var(--header-h)] max-h-[calc(100svh-var(--header-h))] gap-0 overflow-y-auto border-b border-line bg-page p-0 shadow-[0_4px_16px_rgba(0,0,0,0.4)] lg:hidden"
			>
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<div className="border-b border-line-2 px-4 py-3">
					<MobileSearchInput onNavigate={() => setOpen(false)} />
				</div>
				<nav aria-label="Mobile navigation" className="flex flex-col">
					{links.map((link) => (
						<SheetClose
							key={link.href}
							nativeButton={false}
							render={<Link href={link.href} />}
							className="caps block border-b border-gold/10 p-4 text-[0.875rem] text-ink transition-colors last:border-b-0 hover:bg-panel hover:text-gold"
						>
							{link.label}
						</SheetClose>
					))}
					<a
						href="/account"
						className="caps block border-t border-gold/10 p-4 text-[0.875rem] text-ink transition-colors hover:bg-panel hover:text-gold sm:hidden"
					>
						Account
					</a>
				</nav>
			</SheetContent>
		</Sheet>
	);
}
