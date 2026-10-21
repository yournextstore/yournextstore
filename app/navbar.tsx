"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type NavLink = {
	href: string;
	label: string;
};

/** Desktop: the original's quiet Karla links in dim slate, ink on hover. */
export function DesktopNav({ links }: { links: NavLink[] }) {
	return (
		<nav
			aria-label="Main navigation"
			className="ml-auto hidden items-center gap-[clamp(12px,2.2vw,28px)] lg:flex"
		>
			{links.map((link) => (
				<Link
					key={link.href}
					href={link.href}
					className="whitespace-nowrap text-[0.9rem] font-medium text-dim transition-colors hover:text-ink"
				>
					{link.label}
				</Link>
			))}
		</nav>
	);
}

/** Below lg: a foam panel drops from the top with big Bebas links, like a poster's index. */
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
					<Menu className="size-6" strokeWidth={1.75} aria-hidden="true" />
				</button>
			</SheetTrigger>
			<SheetContent
				side="top"
				hideClose
				className="block max-h-svh gap-0 overflow-y-auto border-0 border-b border-line bg-foam px-[18px] pb-8 pt-4 shadow-poster"
			>
				<div className="flex items-center justify-between">
					<SheetTitle className="kicker">[ Menu ]</SheetTitle>
					<SheetClose
						className="inline-flex size-10 items-center justify-center text-ink"
						aria-label="Close menu"
					>
						<X className="size-6" strokeWidth={1.75} aria-hidden="true" />
					</SheetClose>
				</div>
				<div className="mt-3">
					<MobileSearchInput onNavigate={() => setOpen(false)} />
				</div>
				<nav aria-label="Mobile navigation" className="mt-4 flex flex-col">
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							onClick={() => setOpen(false)}
							className="display border-b border-line-soft py-2.5 text-[2.2rem] text-ink transition-colors hover:text-denim"
						>
							{link.label}
						</Link>
					))}
				</nav>
			</SheetContent>
		</Sheet>
	);
}
