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

export function Navbar({ links }: { links: NavLink[] }) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger aria-label="Open menu" className="p-2 transition-opacity hover:opacity-75 lg:hidden">
					<Menu className="h-6 w-6" strokeWidth={1.5} />
				</SheetTrigger>
				<SheetContent
					side="left"
					className="gap-0 overflow-y-auto rounded-none p-0 [&>button:last-child]:text-white [&>button:last-child]:opacity-100"
				>
					<SheetTitle className="sr-only">Menu</SheetTitle>
					<div className="flex h-14 items-center bg-bar px-5 text-bar-foreground">
						<span className="font-extrabold text-xl uppercase">Menu</span>
					</div>
					<div className="px-5 pt-5">
						<MobileSearchInput onNavigate={() => setOpen(false)} />
					</div>
					<nav className="mt-2 flex flex-col px-5">
						{links.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={() => setOpen(false)}
								className="border-b border-border py-4 font-bold text-lg uppercase hover:underline underline-offset-4"
							>
								{link.label}
							</Link>
						))}
					</nav>
				</SheetContent>
			</Sheet>
			<nav
				aria-label="Main"
				className="hidden items-center gap-6 lg:absolute lg:top-1/2 lg:left-1/2 lg:flex lg:-translate-x-1/2 lg:-translate-y-1/2"
			>
				{links.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						className="whitespace-nowrap underline-offset-4 hover:underline"
					>
						{link.label}
					</Link>
				))}
			</nav>
		</>
	);
}
