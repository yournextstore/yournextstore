"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type NavLink = {
	href: string;
	label: string;
};

/** Mobile drawer from the original: a start-side panel with a close chip and plain links. */
export function Navbar({ links }: { links: NavLink[] }) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger aria-label="Open menu" className="chip-btn md:hidden">
				<Menu className="size-7" strokeWidth={1.75} aria-hidden="true" />
			</SheetTrigger>
			<SheetContent
				side="left"
				showCloseButton={false}
				className="gap-6 overflow-y-auto p-4 data-[side=left]:w-[min(20rem,85vw)]"
			>
				<SheetTitle className="sr-only">Navigation menu</SheetTitle>
				<SheetClose
					aria-label="Close menu"
					className="inline-flex size-10 items-center justify-center self-start rounded-full text-(--rose) transition hover:bg-accent"
				>
					<X className="size-6" aria-hidden="true" />
				</SheetClose>
				<nav aria-label="Mobile navigation" className="flex flex-col gap-4">
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							onClick={() => setOpen(false)}
							className="text-base text-foreground underline-offset-4 hover:underline"
						>
							{link.label}
						</Link>
					))}
				</nav>
			</SheetContent>
		</Sheet>
	);
}
