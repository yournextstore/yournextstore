"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type NavLink = {
	href: string;
	label: string;
};

/** Phones and tablets: a hamburger beside the logo opening a left drawer (search + links). */
export function Navbar({ links }: { links: NavLink[] }) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				aria-label="Open menu"
				className="-ml-2 rounded-lg p-2 text-zinc-800 transition-colors hover:text-zinc-500 lg:hidden"
			>
				<Menu className="h-6 w-6" strokeWidth={1.5} />
			</SheetTrigger>
			<SheetContent side="left" className="gap-0 overflow-y-auto bg-white p-0">
				<div className="flex items-center border-b border-border p-5 shadow-sm">
					<SheetTitle className="text-2xl font-bold text-zinc-800">Menu</SheetTitle>
				</div>
				<div className="p-5">
					<MobileSearchInput onNavigate={() => setOpen(false)} />
				</div>
				<nav className="flex flex-col divide-y divide-zinc-100 border-y border-zinc-100 px-5">
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							onClick={() => setOpen(false)}
							className="py-3.5 text-base font-medium text-zinc-700 transition-colors hover:text-emerald-900 hover:underline"
						>
							{link.label}
						</Link>
					))}
				</nav>
			</SheetContent>
		</Sheet>
	);
}

/** Desktop: one quiet row of links under the logo bar. */
export function DesktopNav({ links }: { links: NavLink[] }) {
	return (
		<nav aria-label="Main" className="hidden border-t border-zinc-100 lg:block">
			<ul className="container flex h-11 items-center justify-center gap-8">
				{links.map((link) => (
					<li key={link.href}>
						<Link
							href={link.href}
							className="whitespace-nowrap text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 hover:underline underline-offset-4"
						>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
