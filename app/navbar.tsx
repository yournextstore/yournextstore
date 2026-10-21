"use client";

import { Menu, UserRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type NavLink = {
	href: string;
	label: string;
};

/** GoCart's plain row of links; slate text, no underline or pill. */
export function DesktopNav({ links }: { links: NavLink[] }) {
	return (
		<nav aria-label="Main" className="hidden lg:flex items-center gap-6 xl:gap-8 text-slate-600">
			{links.map((link) => (
				<Link key={link.href} href={link.href} className="whitespace-nowrap transition hover:text-slate-900">
					{link.label}
				</Link>
			))}
		</nav>
	);
}

export function MobileMenu({ links, accountHref }: { links: NavLink[]; accountHref: string }) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button
					type="button"
					aria-label="Open menu"
					className="inline-flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200 lg:hidden"
				>
					<Menu className="size-5" />
				</button>
			</SheetTrigger>
			<SheetContent side="left" className="gap-0 overflow-y-auto p-6">
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<div className="mt-8">
					<MobileSearchInput onNavigate={() => setOpen(false)} />
				</div>
				<nav aria-label="Mobile" className="mt-6 flex flex-col">
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							onClick={() => setOpen(false)}
							className="border-b border-slate-100 py-3.5 text-base text-slate-700 transition hover:text-slate-900"
						>
							{link.label}
						</Link>
					))}
				</nav>
				{/* Plain <a>: /account is a proxied zone, a soft navigation would 500. */}
				<a
					href={accountHref}
					className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-go-indigo px-8 py-2.5 text-white transition hover:bg-indigo-600"
				>
					<UserRound className="size-4" aria-hidden />
					Account
				</a>
			</SheetContent>
		</Sheet>
	);
}
