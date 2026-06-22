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

export function Navbar({ links = [], position }: { links?: NavLink[]; position?: "left" | "right" }) {
	const displayLinks =
		position === "left"
			? links.slice(0, Math.ceil(links.length / 2))
			: position === "right"
				? links.slice(Math.ceil(links.length / 2))
				: links;
	const [open, setOpen] = useState(false);

	return (
		<>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger
					aria-label="Open menu"
					className="-order-1 rounded-full p-2 transition-colors hover:bg-secondary lg:hidden"
				>
					<Menu className="h-6 w-6" />
				</SheetTrigger>
				<SheetContent side="left" className="gap-0 overflow-y-auto p-6">
					<SheetTitle className="sr-only">Menu</SheetTitle>
					<div className="mt-6">
						<MobileSearchInput onNavigate={() => setOpen(false)} />
					</div>
					<nav className="mt-4 flex flex-col gap-1">
						{displayLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={() => setOpen(false)}
								className="rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary"
							>
								{link.label}
							</Link>
						))}
					</nav>
				</SheetContent>
			</Sheet>
			<nav className="hidden md:flex items-center gap-6">
				{displayLinks.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						className="font-display uppercase text-[13px] tracking-[0.12em] text-black hover:text-[var(--yns-cyan)] transition-colors"
					>
						{link.label}
					</Link>
				))}
			</nav>
		</>
	);
}
