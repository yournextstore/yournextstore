"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { YnsLink } from "@/components/yns-link";
import { MobileSearchInput } from "./search-input";

export type NavLink = {
	href: string;
	label: string;
};

export function Navbar({ links }: { links: NavLink[] }) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<button
						type="button"
						aria-label="Open menu"
						className="-order-1 rounded-full p-2 transition-colors hover:bg-secondary lg:hidden"
					>
						<Menu className="h-6 w-6" />
					</button>
				</SheetTrigger>
				<SheetContent side="left" className="gap-0 overflow-y-auto p-6">
					<SheetTitle className="sr-only">Menu</SheetTitle>
					<div className="mt-6">
						<MobileSearchInput onNavigate={() => setOpen(false)} />
					</div>
					<nav className="mt-4 flex flex-col gap-1">
						{links.map((link) => (
							<YnsLink
								key={link.href}
								prefetch="eager"
								href={link.href}
								onClick={() => setOpen(false)}
								className="rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary"
							>
								{link.label}
							</YnsLink>
						))}
					</nav>
				</SheetContent>
			</Sheet>
			<nav className="hidden lg:absolute lg:left-1/2 lg:top-1/2 lg:flex lg:-translate-x-1/2 lg:-translate-y-1/2 items-center gap-6">
				{links.map((link) => (
					<YnsLink
						key={link.href}
						prefetch="eager"
						href={link.href}
						className="group relative px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
					>
						{link.label}
					</YnsLink>
				))}
			</nav>
		</>
	);
}
