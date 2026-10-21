"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type NavLink = {
	href: string;
	label: string;
};

export function Navbar({ links }: { links: NavLink[] }) {
	return (
		<nav aria-label="Main" className="mr-2 hidden items-center gap-5 lg:flex">
			{links.map((link) => (
				<Link
					key={link.href}
					href={link.href}
					className="whitespace-nowrap text-base transition-colors hover:text-foreground/70"
				>
					{link.label}
				</Link>
			))}
		</nav>
	);
}

/** Fluid's mobile menu: a bottom drawer with a grab handle and large text links. */
export function MobileMenu({ links }: { links: NavLink[] }) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button
					type="button"
					aria-label="Open menu"
					className="inline-flex size-10 items-center justify-center rounded-md transition-colors hover:bg-secondary lg:hidden"
				>
					<Menu className="size-6" strokeWidth={1.75} />
				</button>
			</SheetTrigger>
			<SheetContent
				side="bottom"
				className="block h-[75svh] overflow-y-auto rounded-t-2xl border-0 px-6 pb-10 pt-4"
			>
				<div aria-hidden="true" className="mx-auto h-2 w-24 rounded-full bg-muted" />
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<SheetDescription className="sr-only">Browse the store</SheetDescription>
				<nav aria-label="Mobile" className="mt-8 flex flex-col">
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							onClick={() => setOpen(false)}
							className="px-4 py-3 text-xl transition-colors hover:text-foreground/70"
						>
							{link.label}
						</Link>
					))}
				</nav>
				<div className="mt-6 px-4">
					<MobileSearchInput onNavigate={() => setOpen(false)} />
				</div>
			</SheetContent>
		</Sheet>
	);
}
