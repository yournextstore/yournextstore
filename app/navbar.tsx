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

/** Desktop: the original's quiet links in dim cream, brightening on hover. */
export function DesktopNav({ links }: { links: NavLink[] }) {
	return (
		<nav aria-label="Main navigation" className="hidden items-center gap-[clamp(14px,2vw,30px)] lg:flex">
			{links.map((link) => (
				<Link
					key={link.href}
					href={link.href}
					className="whitespace-nowrap text-[0.88rem] text-dim transition-colors duration-300 hover:text-cream"
				>
					{link.label}
				</Link>
			))}
		</nav>
	);
}

/** Below lg: a burgundy panel from the right, links set large in Cormorant like the section heads. */
export function MobileNav({ links }: { links: NavLink[] }) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button
					type="button"
					aria-label="Open menu"
					className="inline-flex size-10 items-center justify-center text-cream lg:hidden"
				>
					<Menu className="size-6" strokeWidth={1.5} />
				</button>
			</SheetTrigger>
			<SheetContent
				side="right"
				hideClose
				className="block w-full overflow-y-auto border-l border-line bg-page px-[clamp(18px,4vw,48px)] pb-10 pt-0 sm:max-w-md"
			>
				<div className="flex h-[var(--header-h)] items-center justify-between">
					<SheetTitle className="kicker font-normal text-gold">Nº 00 — Contents</SheetTitle>
					<SheetClose
						aria-label="Close menu"
						className="-mr-2 inline-flex size-10 items-center justify-center text-cream"
					>
						<X className="size-6" strokeWidth={1.5} />
					</SheetClose>
				</div>
				<div className="border-y border-line py-4">
					<MobileSearchInput onNavigate={() => setOpen(false)} />
				</div>
				<nav aria-label="Mobile navigation" className="mt-2 flex flex-col">
					{links.map((link, index) => (
						<Link
							key={link.href}
							href={link.href}
							onClick={() => setOpen(false)}
							className="group flex items-baseline gap-4 border-b border-line-2 py-3.5"
						>
							<span className="ledger w-8 text-[0.62rem] text-faint">
								{String(index + 1).padStart(2, "0")}
							</span>
							<span className="serif text-[1.9rem] font-medium leading-tight text-cream transition-colors group-hover:text-gold-2">
								{link.label}
							</span>
						</Link>
					))}
				</nav>
			</SheetContent>
		</Sheet>
	);
}
