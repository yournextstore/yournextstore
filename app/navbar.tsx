"use client";

import Link from "next/link";
import { useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

export type NavLink = {
	href: string;
	label: string;
};

/** Phones and tablets: a "Menu" word opens the shop map in the same #1a1a1a panel as the cart. */
export function Navbar({
	links,
	accountHref,
	storeName,
}: {
	links: NavLink[];
	accountHref: string;
	storeName: string;
}) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button type="button" className="underline-offset-[0.3em] hover:underline lg:hidden">
					Menu
				</button>
			</SheetTrigger>
			<SheetContent
				side="right"
				hideClose
				className="block w-full overflow-y-auto border-l-0 bg-panel p-0 text-snow sm:max-w-md"
			>
				<div className="flex h-16 items-center justify-between border-b border-snow/80 mx-4">
					<SheetTitle className="font-normal text-base">{storeName}</SheetTitle>
					<SheetClose className="text-base underline-offset-[0.3em] hover:underline">Close</SheetClose>
				</div>
				<SheetDescription className="sr-only">Shop categories, collections and pages</SheetDescription>
				<div className="px-4 pt-6">
					<MobileSearchInput onNavigate={() => setOpen(false)} />
				</div>
				<nav aria-label="Menu" className="flex flex-col px-4 pt-4">
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							onClick={() => setOpen(false)}
							className="border-b border-snow/15 py-3 text-2xl"
						>
							{link.label}
						</Link>
					))}
					<a href={accountHref} className="py-3 text-2xl">
						Account
					</a>
				</nav>
			</SheetContent>
		</Sheet>
	);
}
