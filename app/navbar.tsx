"use client";

import Link from "next/link";
import { useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type NavLink = {
	href: string;
	label: string;
};

/** Centred text links, lg and up (the hamburger menu covers narrower screens). */
export function DesktopNav({ links }: { links: NavLink[] }) {
	return (
		<nav aria-label="Main" className="flex items-center gap-8 max-lg:hidden">
			{links.map((link) => (
				<Link
					key={link.href}
					href={link.href}
					className="whitespace-nowrap text-body transition-opacity hover:opacity-70"
				>
					{link.label}
				</Link>
			))}
		</nav>
	);
}

/** Below lg: a full-height black drawer from the left with search and oversized links. */
export function MobileMenu({ links }: { links: NavLink[] }) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				aria-label="Open menu"
				className="-mr-1 inline-flex size-8 items-center justify-center lg:hidden"
			>
				<MenuIcon className="size-6" />
			</SheetTrigger>
			<SheetContent
				side="left"
				showCloseButton={false}
				className="gap-0 border-0 bg-foreground p-0 text-primary-foreground data-[side=left]:w-full data-[side=left]:max-w-75 data-[side=left]:border-r-0 data-[side=left]:sm:max-w-75"
			>
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<SheetDescription className="sr-only">Site navigation and product search</SheetDescription>
				<div className="mb-8 flex items-start gap-4 border-b border-primary-foreground px-8 pt-5 pb-6">
					<div className="min-w-0 flex-1">
						<MobileSearchInput onNavigate={() => setOpen(false)} />
					</div>
					<button
						type="button"
						onClick={() => setOpen(false)}
						aria-label="Close menu"
						className="inline-flex size-8 shrink-0 items-center justify-center"
					>
						<CloseIcon className="size-6" />
					</button>
				</div>
				<nav aria-label="Main" className="flex flex-col gap-8 overflow-y-auto px-8 pb-8">
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							onClick={() => setOpen(false)}
							className="text-title-lg font-medium leading-none"
						>
							{link.label}
						</Link>
					))}
				</nav>
			</SheetContent>
		</Sheet>
	);
}
