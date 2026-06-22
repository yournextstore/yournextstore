"use client";

import { ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type NavLink = {
	href: string;
	label: string;
};

export function Navbar({ links }: { links: NavLink[] }) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				aria-label="Open menu"
				className="col-span-1 md:col-span-1 h-full flex items-center justify-center cursor-pointer hover:bg-secondary/50 transition-colors relative overflow-hidden group"
			>
				<Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
				<span className="ml-2 font-mono font-bold text-sm hidden sm:inline">MENU</span>
			</SheetTrigger>
			<SheetContent
				side="right"
				className="gap-0 overflow-y-auto p-0 border-l border-foreground/10 bg-background"
			>
				<SheetTitle className="h-20 flex items-center px-6 border-b border-foreground/10 font-mono text-xs uppercase tracking-widest text-primary">
					Menu
				</SheetTitle>
				<div className="px-6 py-6 border-b border-foreground/10">
					<MobileSearchInput onNavigate={() => setOpen(false)} />
				</div>
				<nav className="flex flex-col">
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							onClick={() => setOpen(false)}
							className="group flex items-center justify-between px-6 py-5 border-b border-foreground/10 text-sm font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors"
						>
							{link.label}
							<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
						</Link>
					))}
				</nav>
			</SheetContent>
		</Sheet>
	);
}
