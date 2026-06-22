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

// The links come from the layout's cached `getNavLinks`, so the nav never reads the request.
export function Navbar({ links }: { links: NavLink[] }) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger
					aria-label="Open menu"
					className="-order-1 rounded-full p-2 text-white/90 transition-colors hover:bg-white/5 hover:text-gold lg:hidden"
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
								className="rounded-sm px-3 py-3 text-base font-medium uppercase tracking-wide text-foreground transition-colors hover:bg-secondary hover:text-primary"
							>
								{link.label}
							</Link>
						))}
					</nav>
				</SheetContent>
			</Sheet>
			<nav className="hidden lg:flex items-center gap-1">
				{links.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						className="px-4 py-3 text-sm font-medium text-white/90 hover:text-gold hover:bg-white/5 transition-colors uppercase tracking-wide whitespace-nowrap"
					>
						{link.label}
					</Link>
				))}
			</nav>
		</>
	);
}
