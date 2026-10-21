"use client";

import Link from "next/link";
import { useState } from "react";
import { IconClose, IconMenu } from "@/components/garden/icons";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type NavLink = {
	href: string;
	label: string;
};

type Brand = { name: string; initial: string; tagline: string };

/** Full-screen paper menu that drops from the top, as on the original's phones and tablets. */
export function MobileMenu({ links, brand }: { links: NavLink[]; brand: Brand }) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger aria-label="Open menu" className="icon-btn menu-btn">
				<IconMenu />
			</SheetTrigger>
			<SheetContent
				side="top"
				showCloseButton={false}
				className="gap-0 overflow-y-auto bg-[var(--paper)] p-0 shadow-none data-[side=top]:h-dvh data-[side=top]:border-0"
			>
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<div className="wrap flex h-[var(--header-h)] shrink-0 items-center justify-between">
					<Link href="/" className="brand" onClick={() => setOpen(false)}>
						<span className="brand__mark" aria-hidden="true">
							{brand.initial}
						</span>
						<span className="brand__text">
							<span className="brand__name">{brand.name}</span>
						</span>
					</Link>
					<SheetClose className="close-x" aria-label="Close menu">
						<IconClose className="h-5 w-5" />
					</SheetClose>
				</div>
				<div className="wrap pb-12 pt-2">
					<MobileSearchInput onNavigate={() => setOpen(false)} />
					<nav className="mobile-nav__links mt-6" aria-label="Mobile">
						{links.map((link) => (
							<Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
								{link.label}
								<span>view</span>
							</Link>
						))}
					</nav>
					<p className="hand mt-8">Thank you for shopping small.</p>
				</div>
			</SheetContent>
		</Sheet>
	);
}
