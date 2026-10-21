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

/** The original's two words at the header's inline start: Shop, About. */
export function DesktopNav({ links }: { links: NavLink[] }) {
	return (
		<nav aria-label="Main" className="hidden items-center gap-6 sm:flex">
			{links.map((link) => (
				<Link
					key={link.href}
					href={link.href}
					className="text-body whitespace-nowrap transition-opacity hover:opacity-70"
				>
					{link.label}
				</Link>
			))}
		</nav>
	);
}

/** Below 640px: the menu icon beside the wordmark opens a charcoal sheet of large centred links. */
export function MobileMenu({
	links,
	storeName,
	accountHref,
}: {
	links: NavLink[];
	storeName: string;
	accountHref: string;
}) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button
					type="button"
					aria-label="Open menu"
					className="-ml-1 inline-flex size-9 shrink-0 items-center justify-center sm:hidden"
				>
					<MenuIcon className="size-7" />
				</button>
			</SheetTrigger>
			<SheetContent
				side="top"
				className="h-svh gap-0 border-0 bg-[var(--charcoal)] p-0 text-white shadow-none [&>button:last-child]:hidden"
			>
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<SheetDescription className="sr-only">Site navigation</SheetDescription>
				<div className="flex h-18 shrink-0 items-center gap-2 border-b border-black bg-background px-4 font-semibold text-foreground">
					<button
						type="button"
						onClick={() => setOpen(false)}
						aria-label="Close menu"
						className="-ml-1 inline-flex size-9 items-center justify-center"
					>
						<CloseIcon className="size-7" />
					</button>
					<span className="truncate text-[1.375rem] leading-none font-semibold tracking-[-0.04em] lowercase">
						{storeName}
					</span>
				</div>
				<div className="flex flex-1 flex-col justify-center overflow-y-auto px-6 py-12">
					<nav aria-label="Mobile" className="flex flex-col items-center gap-6">
						{links.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={() => setOpen(false)}
								className="text-center text-heading font-semibold"
							>
								{link.label}
							</Link>
						))}
						<a href={accountHref} className="text-center text-heading font-semibold">
							Account
						</a>
					</nav>
					<div className="mx-auto mt-12 w-full max-w-sm bg-background p-3 text-foreground">
						<MobileSearchInput onNavigate={() => setOpen(false)} />
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
