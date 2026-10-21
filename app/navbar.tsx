"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type NavLink = {
	href: string;
	label: string;
};

/** Desktop links: plain text on the moss bar, underlined on hover (from lg; the drawer covers below). */
export function Navbar({ links }: { links: NavLink[] }) {
	return (
		<nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
			{links.map((link) => (
				<Link
					key={link.href}
					href={link.href}
					className="whitespace-nowrap py-4 text-base underline-offset-8 decoration-white/70 hover:underline"
				>
					{link.label}
				</Link>
			))}
		</nav>
	);
}

/** The original's side navigation: a white panel from the left with a bold "Navigation" title. */
export function MobileNav({ links }: { links: NavLink[] }) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				aria-label="Open menu"
				className="rounded-full p-2 transition-colors hover:bg-white/10 lg:hidden"
			>
				<Menu className="size-6" strokeWidth={1.5} aria-hidden="true" />
			</SheetTrigger>
			<SheetContent
				side="left"
				closeLabel="Close menu"
				className="gap-0 overflow-y-auto bg-white p-0 data-[side=left]:w-[calc(100%-2.5rem)] data-[side=left]:sm:max-w-sm"
			>
				<div className="px-4 pt-6 pb-2 sm:px-6">
					<SheetTitle className="text-lg font-bold">Navigation</SheetTitle>
					<SheetDescription className="sr-only">Browse the store</SheetDescription>
				</div>
				<div className="px-4 pt-4 sm:px-6">
					<MobileSearchInput onNavigate={() => setOpen(false)} />
				</div>
				<nav aria-label="Mobile" className="flex flex-col px-4 py-4 sm:px-6">
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							onClick={() => setOpen(false)}
							className="rounded-md px-4 py-3 text-base text-slate-700 transition-colors hover:bg-cream hover:text-ink"
						>
							{link.label}
						</Link>
					))}
					{/* Plain <a>: /account is a proxied zone. */}
					<a
						href="/account"
						className="rounded-md px-4 py-3 text-base text-slate-700 transition-colors hover:bg-cream hover:text-ink"
					>
						Account
					</a>
				</nav>
			</SheetContent>
		</Sheet>
	);
}
