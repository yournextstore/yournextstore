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

// The mobile menu holds state, so it is the only client part of the navbar; the links come from the cached Navbar.
export function NavbarMenu({ links }: { links: NavLink[] }) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				aria-label="Open menu"
				className="-order-1 rounded-full p-2 transition-colors hover:bg-secondary sm:hidden"
			>
				<Menu className="h-6 w-6" />
			</SheetTrigger>
			<SheetContent side="left" className="gap-0 overflow-y-auto p-6">
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<div className="mt-6">
					<MobileSearchInput onNavigate={() => setOpen(false)} />
				</div>
				<nav className="mt-4 flex flex-col gap-1">
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							onClick={() => setOpen(false)}
							className="rounded-lg px-3 py-3 text-[13px] font-medium tracking-wide uppercase text-foreground transition-colors hover:bg-secondary hover:text-primary"
						>
							{link.label}
						</Link>
					))}
				</nav>
			</SheetContent>
		</Sheet>
	);
}
