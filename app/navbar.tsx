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

/** Desktop: the original's quiet uppercase links. */
export function DesktopNav({ links }: { links: NavLink[] }) {
	return (
		<nav aria-label="Main navigation" className="ml-auto hidden items-center gap-8 lg:flex xl:gap-[34px]">
			{links.map((link) => (
				<Link
					key={link.href}
					href={link.href}
					className="caps whitespace-nowrap text-muted-foreground transition-colors hover:text-coral-text"
				>
					{link.label}
				</Link>
			))}
		</nav>
	);
}

/** Below lg: the ☰ toggle drops a pale panel of links under the header, as the original does. */
export function MobileNav({ links }: { links: NavLink[] }) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button
					type="button"
					aria-label="Open menu"
					className="inline-flex size-10 items-center justify-center text-ink lg:hidden"
				>
					<Menu className="size-7" strokeWidth={1.5} />
				</button>
			</SheetTrigger>
			<SheetContent
				side="top"
				className="block max-h-svh gap-0 overflow-y-auto border-0 bg-paper px-5 pb-6 pt-5 shadow-float"
			>
				<SheetTitle className="eyebrow">Menu</SheetTitle>
				<div className="mt-4">
					<MobileSearchInput onNavigate={() => setOpen(false)} />
				</div>
				<nav aria-label="Mobile navigation" className="mt-3 flex flex-col">
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							onClick={() => setOpen(false)}
							className="caps py-2.5 text-muted-foreground transition-colors hover:text-coral-text"
						>
							{link.label}
						</Link>
					))}
				</nav>
			</SheetContent>
		</Sheet>
	);
}
