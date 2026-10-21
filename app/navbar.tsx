"use client";

import { AlignLeft, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { NavLink } from "@/lib/catalog";

/** Horizon's desktop menu: uppercase medium links, left of the centred wordmark. */
export function Navbar({ links }: { links: NavLink[] }) {
	return (
		<nav aria-label="Main" className="hidden min-w-0 items-center gap-x-8 xl:flex 2xl:gap-x-10">
			{links.map((link) => (
				<Link
					key={link.href}
					href={link.href}
					className="caps whitespace-nowrap text-[0.9375rem] font-medium text-ink transition-opacity hover:opacity-70 2xl:text-base"
				>
					{link.label}
				</Link>
			))}
		</nav>
	);
}

/** Below xl: the hamburger opens a white panel that drops from the top, links in caps. */
export function MobileMenu({
	links,
	storeName,
	accountHref,
}: {
	links: NavLink[];
	storeName: string;
	accountHref: string;
}) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				aria-label="Open menu"
				className="-ml-2 inline-flex size-10 items-center justify-center text-ink xl:hidden"
			>
				<AlignLeft className="h-6 w-6" strokeWidth={1.75} />
			</SheetTrigger>
			<SheetContent
				side="top"
				showCloseButton={false}
				className="max-h-svh gap-0 overflow-y-auto px-4 pb-8 pt-0 data-[side=top]:border-0 lg:px-10"
			>
				<div className="flex h-[3.75rem] items-center justify-between lg:h-[5.5rem]">
					<SheetTitle className="truncate text-[1.375rem] font-semibold uppercase leading-none tracking-[0.14em] text-ink">
						{storeName}
					</SheetTitle>
					<SheetClose
						className="-mr-2 inline-flex size-10 items-center justify-center text-ink"
						aria-label="Close menu"
					>
						<X className="h-6 w-6" strokeWidth={1.75} />
					</SheetClose>
				</div>
				<nav aria-label="Main" className="mt-4 flex flex-col">
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							onClick={() => setOpen(false)}
							className="caps py-3.5 text-base font-semibold text-ink"
						>
							{link.label}
						</Link>
					))}
					{/* Plain <a>: /account is a proxied zone (see AGENTS.md). */}
					<a href={accountHref} className="caps py-3.5 text-base font-semibold text-ink">
						Account
					</a>
				</nav>
				<div className="mt-6">
					<MobileSearchInput onNavigate={() => setOpen(false)} />
				</div>
			</SheetContent>
		</Sheet>
	);
}
