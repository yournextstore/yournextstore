"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type NavLink = {
	href: string;
	label: string;
};

/** Desktop: bold uppercase links in ink, left of the centred wordmark. */
export function DesktopNav({ links }: { links: NavLink[] }) {
	return (
		<nav aria-label="Main navigation" className="hidden items-center gap-x-5 xl:flex">
			{/* Four fit beside the centred wordmark; About lives in the menu and the footer. */}
			{links
				.filter((link) => link.href !== "/about")
				.slice(0, 4)
				.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						className="whitespace-nowrap pt-0.5 text-[0.95rem] font-bold uppercase tracking-wide text-ink underline-offset-[6px] transition-colors hover:text-orange hover:underline"
					>
						{link.label}
					</Link>
				))}
		</nav>
	);
}

/** Below xl: a lime panel drops from the top with big display links, like the original's "Try all five flavors". */
export function MobileNav({ links }: { links: NavLink[] }) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button
					type="button"
					aria-label="Open menu"
					className="-ml-2 inline-flex size-10 items-center justify-center rounded-full text-ink hover:bg-ink/10 xl:hidden"
				>
					<Menu className="size-6" strokeWidth={2.5} aria-hidden="true" />
				</button>
			</SheetTrigger>
			<SheetContent
				side="top"
				hideClose
				className="block max-h-svh gap-0 overflow-y-auto rounded-b-3xl border-0 bg-lime px-4 pb-8 pt-4 shadow-float md:px-6"
			>
				<div className="flex items-center justify-between">
					<SheetTitle className="pt-1 text-sm font-bold uppercase tracking-[0.18em] text-ink">
						Menu
					</SheetTitle>
					<SheetClose
						className="inline-flex size-10 items-center justify-center rounded-full text-ink hover:bg-ink/10"
						aria-label="Close menu"
					>
						<X className="size-6" strokeWidth={2.5} aria-hidden="true" />
					</SheetClose>
				</div>
				<div className="mt-3">
					<MobileSearchInput onNavigate={() => setOpen(false)} />
				</div>
				<nav aria-label="Mobile navigation" className="mt-5 flex flex-col">
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							onClick={() => setOpen(false)}
							className="display border-b-2 border-ink/15 pb-2.5 pt-4 text-[2.6rem] text-ink transition-colors hover:text-orange"
						>
							{link.label}
						</Link>
					))}
				</nav>
			</SheetContent>
		</Sheet>
	);
}
