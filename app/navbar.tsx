"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { gfIconButton } from "@/lib/gf-styles";

export type NavLink = {
	href: string;
	label: string;
};

export type NavGroup = {
	title: string;
	links: NavLink[];
};

export function Navbar({ groups, storeName }: { groups: NavGroup[]; storeName: string }) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button type="button" aria-label="Open menu" className={gfIconButton}>
					<Menu className="size-6" strokeWidth={1.75} />
				</button>
			</SheetTrigger>
			<SheetContent
				side="bottom"
				hideClose
				className="mx-auto block max-h-[88svh] w-full max-w-[40rem] overflow-y-auto rounded-t-[30px] border-0 px-6 pt-6 pb-10"
			>
				<div className="flex items-center justify-between gap-4">
					<SheetTitle className="text-gf-h3 font-bold">{storeName}</SheetTitle>
					<SheetClose className={gfIconButton} aria-label="Close menu">
						<X className="size-5" />
					</SheetClose>
				</div>
				<div className="mt-5">
					<MobileSearchInput onNavigate={() => setOpen(false)} />
				</div>
				{groups.map((group) => (
					<nav key={group.title} aria-label={group.title} className="mt-6">
						<h2 className="text-gf-h5 font-bold">{group.title}</h2>
						<ul className="mt-3 flex flex-wrap gap-2.5">
							{group.links.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										onClick={() => setOpen(false)}
										className="inline-flex min-h-11 items-center rounded-full bg-flash-white px-5 text-gf-h6 font-bold transition-colors hover:bg-light-silver"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				))}
			</SheetContent>
		</Sheet>
	);
}
