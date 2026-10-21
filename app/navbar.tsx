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

export function Navbar({ links }: { links: NavLink[] }) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<nav aria-label="Primary" className="hidden items-center gap-[clamp(14px,2.2vw,28px)] lg:flex">
				{links.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						className="font-field max-w-[18ch] truncate text-[0.78rem] tracking-[0.04em] whitespace-nowrap text-dim uppercase transition-colors hover:text-ink"
					>
						{link.label}
					</Link>
				))}
			</nav>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<button
						type="button"
						aria-label="Open menu"
						className="inline-flex p-1.5 text-dim transition-colors hover:text-ink lg:hidden"
					>
						<Menu className="h-5 w-5" aria-hidden="true" />
					</button>
				</SheetTrigger>
				<SheetContent
					side="right"
					hideClose
					className="block w-full gap-0 overflow-y-auto border-line bg-page p-0 sm:max-w-sm"
				>
					<div className="flex h-16 items-center justify-between border-b border-line px-4">
						<SheetTitle className="eyebrow">
							<span className="grid-ref" aria-hidden="true">
								[ NAV ]
							</span>
							Field menu
						</SheetTitle>
						<SheetClose className="p-1.5 text-dim hover:text-ink" aria-label="Close menu">
							<X className="h-5 w-5" aria-hidden="true" />
						</SheetClose>
					</div>
					<div className="px-4 pt-5">
						<MobileSearchInput onNavigate={() => setOpen(false)} />
					</div>
					<nav aria-label="Mobile" className="mt-4 flex flex-col border-t border-line">
						{links.map((link, i) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={() => setOpen(false)}
								className="flex items-baseline gap-4 border-b border-line px-4 py-4 transition-colors hover:bg-panel"
							>
								<span className="font-field text-[0.72rem] font-bold text-signal">
									{String(i + 1).padStart(2, "0")}
								</span>
								<span className="font-display text-[1.9rem] text-ink [overflow-wrap:anywhere]">
									{link.label}
								</span>
							</Link>
						))}
						<a
							href="/account"
							className="flex items-baseline gap-4 border-b border-line px-4 py-4 transition-colors hover:bg-panel"
						>
							<span className="font-field text-[0.72rem] font-bold text-signal">
								{String(links.length + 1).padStart(2, "0")}
							</span>
							<span className="font-display text-[1.9rem] text-ink">Account</span>
						</a>
					</nav>
					<span aria-hidden="true" className="hatch mt-8 ml-4 block h-2 w-[120px] opacity-50" />
				</SheetContent>
			</Sheet>
		</>
	);
}
