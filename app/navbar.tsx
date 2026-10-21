"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BrandMark } from "@/components/brand-mark";
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
			<nav aria-label="Primary" className="mr-1 hidden items-center gap-0.5 lg:flex">
				{links.map((link) => (
					<Link key={link.href} href={link.href} className="hs-nav-link">
						{link.label}
					</Link>
				))}
			</nav>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger aria-label="Open menu" className="hs-icon-btn order-last lg:hidden">
					<Menu className="size-[17px]" strokeWidth={1.7} />
				</SheetTrigger>
				<SheetContent
					side="left"
					className="block overflow-y-auto border-line bg-background p-0 data-[side=left]:w-[86%]"
				>
					<SheetTitle className="sr-only">Menu</SheetTitle>
					<div className="flex h-full flex-col px-5 pb-6 pt-5">
						<p className="hs-kicker flex items-center gap-2">
							<BrandMark className="size-5" />[ Index ]
						</p>
						<div className="mt-6">
							<MobileSearchInput onNavigate={() => setOpen(false)} />
						</div>
						<nav aria-label="Mobile" className="mt-6 flex flex-col border-t border-line">
							{links.map((link, index) => (
								<Link
									key={link.href}
									href={link.href}
									onClick={() => setOpen(false)}
									className="group flex items-baseline gap-3 border-b border-line py-3.5"
								>
									<span className="hs-mono text-[0.7rem] text-faint">
										{String(index + 1).padStart(2, "0")}
									</span>
									<span className="hs-display text-[1.6rem] transition-colors group-hover:text-signal">
										{link.label}
									</span>
								</Link>
							))}
						</nav>
						<a href="/account" className="hs-label mt-6 hover:text-foreground">
							Account →
						</a>
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
}
