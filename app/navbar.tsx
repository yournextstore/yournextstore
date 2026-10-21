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

// The desktop bar keeps the original's short row; the full list lives in the mobile menu.
const DESKTOP_LINK_LIMIT = 5;

export function Navbar({ links, storeName }: { links: NavLink[]; storeName: string }) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger
					aria-label="Open menu"
					className="mr-1 rounded-lg p-1.5 transition-colors hover:bg-contrast-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime lg:hidden"
				>
					<Menu className="size-6" strokeWidth={1} />
				</SheetTrigger>
				<SheetContent
					side="top"
					showClose={false}
					className="mx-2 mt-2 max-h-[calc(100svh-1rem)] gap-0 overflow-y-auto rounded-2xl border-0 bg-background p-0 shadow-xl ring-1 ring-foreground/10 data-[side=top]:border-b-0"
				>
					<SheetTitle className="sr-only">Menu</SheetTitle>
					<div className="flex items-center justify-between py-2 pr-2 pl-3">
						<div className="flex min-w-0 items-center">
							<SheetClose
								aria-label="Close menu"
								className="mr-1 rounded-lg p-1.5 transition-colors hover:bg-contrast-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
							>
								<X className="size-6" strokeWidth={1} />
							</SheetClose>
							<Link
								href="/"
								onClick={() => setOpen(false)}
								className="truncate font-heading text-2xl leading-none"
							>
								{storeName}
							</Link>
						</div>
					</div>
					<div className="divide-y divide-contrast-100 border-t border-contrast-100">
						<div className="p-4">
							<MobileSearchInput onNavigate={() => setOpen(false)} />
						</div>
						<nav className="flex flex-col p-2">
							{links.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									onClick={() => setOpen(false)}
									className="block rounded-lg px-3 py-2 font-semibold transition-colors hover:bg-contrast-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
								>
									{link.label}
								</Link>
							))}
						</nav>
						<nav className="flex flex-col p-2" aria-label="More">
							<Link
								href="/about"
								onClick={() => setOpen(false)}
								className="block rounded-lg px-3 py-2 text-sm font-medium text-contrast-500 transition-colors hover:bg-contrast-100 hover:text-foreground"
							>
								About
							</Link>
							<Link
								href="/faq"
								onClick={() => setOpen(false)}
								className="block rounded-lg px-3 py-2 text-sm font-medium text-contrast-500 transition-colors hover:bg-contrast-100 hover:text-foreground"
							>
								FAQ
							</Link>
						</nav>
					</div>
				</SheetContent>
			</Sheet>
			<nav
				aria-label="Main"
				className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 lg:flex xl:gap-2"
			>
				{links.slice(0, DESKTOP_LINK_LIMIT).map((link) => (
					<Link
						key={link.href}
						href={link.href}
						className="rounded-xl p-2.5 text-sm font-medium whitespace-nowrap transition-colors hover:bg-contrast-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
					>
						{link.label}
					</Link>
				))}
			</nav>
		</>
	);
}
