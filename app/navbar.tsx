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

const navLinkClass =
	"text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase text-[#0f0f10] hover:text-[#e11226] transition-colors";

export function Navbar({ links }: { links: NavLink[] }) {
	const [open, setOpen] = useState(false);

	return (
		<>
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
								className={`rounded-lg px-3 py-3 ${navLinkClass}`}
							>
								{link.label}
							</Link>
						))}
					</nav>
				</SheetContent>
			</Sheet>
			<nav className="hidden sm:flex items-center gap-7 lg:gap-9">
				{links.map((link) => (
					<Link key={link.href} href={link.href} className={navLinkClass}>
						{link.label}
					</Link>
				))}
			</nav>
		</>
	);
}
