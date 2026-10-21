"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MenuIcon } from "@/components/icons";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type NavLink = {
	href: string;
	label: string;
};

/** Mobile menu: the original's full-height drawer with a centred "Menu" title and uppercase serif links. */
export function Navbar({ links, storeName }: { links: NavLink[]; storeName: string }) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				aria-label="Open menu"
				className="inline-flex size-10 items-center justify-center rounded-full transition-colors hover:bg-secondary lg:hidden"
			>
				<MenuIcon className="size-6" />
			</SheetTrigger>
			<SheetContent
				side="left"
				className="gap-0 bg-card p-0 data-[side=left]:w-full data-[side=left]:border-0 data-[side=left]:sm:max-w-sm"
			>
				<div className="flex h-14 items-center justify-center border-b border-border">
					<SheetTitle className="font-heading text-xl font-normal uppercase tracking-wide">Menu</SheetTitle>
				</div>
				<SheetDescription className="sr-only">Browse {storeName}</SheetDescription>
				<nav aria-label="Mobile" className="flex flex-col gap-1 px-6 py-6">
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							onClick={() => setOpen(false)}
							className="flex items-center justify-between py-2.5 font-heading text-[22px] uppercase leading-tight text-secondary-foreground transition-colors hover:text-foreground"
						>
							{link.label}
							<ChevronRight className="size-4 shrink-0 opacity-70" aria-hidden="true" />
						</Link>
					))}
				</nav>
			</SheetContent>
		</Sheet>
	);
}
