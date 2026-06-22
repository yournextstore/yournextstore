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

const baseClass =
	"jolt-eyebrow text-foreground/80 hover:text-foreground transition-colors relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-[#ffcc00] hover:after:w-full after:transition-all";

export function Navbar({ links }: { links: NavLink[] }) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<button
						type="button"
						aria-label="Open menu"
						className="-order-1 rounded-full p-2 transition-colors hover:bg-secondary md:hidden"
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
								className="rounded-lg px-3 py-3 jolt-eyebrow text-foreground/80 hover:text-foreground transition-colors"
							>
								{link.label}
							</YnsLink>
						))}
					</nav>
				</SheetContent>
			</Sheet>
			<nav className="hidden md:flex items-center gap-7">
				{links.map((link) => (
					<YnsLink prefetch={"eager"} key={link.href} href={link.href} className={baseClass}>
						{link.label}
					</YnsLink>
				))}
			</nav>
		</>
	);
}
