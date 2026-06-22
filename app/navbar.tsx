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
						className="-order-1 rounded-full p-2 transition-colors hover:bg-secondary sm:hidden"
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
								className="rounded-lg px-3 py-3 text-[15px] font-medium text-foreground hover:text-[color:var(--yns-terracotta)] transition-colors"
							>
								{link.label}
							</YnsLink>
						))}
					</nav>
				</SheetContent>
			</Sheet>
			<nav className="hidden sm:flex items-center gap-8 lg:gap-12">
				{links.map((link) => (
					<YnsLink
						prefetch="eager"
						key={link.href}
						href={link.href}
						className="text-[15px] font-medium text-foreground hover:text-[color:var(--yns-terracotta)] transition-colors"
					>
						{link.label}
					</YnsLink>
				))}
			</nav>
		</>
	);
}
