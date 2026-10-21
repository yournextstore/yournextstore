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
						className="font-readout max-w-[18ch] truncate text-[0.8rem] tracking-[0.04em] whitespace-nowrap text-dim transition-colors hover:text-ink"
					>
						{link.label}
					</Link>
				))}
			</nav>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger
					aria-label="Open menu"
					className="inline-flex p-1.5 text-dim transition-colors hover:text-ink lg:hidden"
				>
					<Menu className="h-5 w-5" aria-hidden="true" />
				</SheetTrigger>
				<SheetContent
					side="right"
					showCloseButton={false}
					className="block gap-0 overflow-y-auto border-line bg-page p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-sm"
				>
					<div className="flex h-16 items-center justify-between border-b border-line px-4">
						<SheetTitle className="eyebrow text-copper">Menu</SheetTitle>
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
								<span className="font-readout text-[0.8rem] font-medium text-copper">
									{String(i + 1).padStart(2, "0")}
								</span>
								<span className="font-display text-[2rem] leading-[1.05] text-ink [overflow-wrap:anywhere]">
									{link.label}
								</span>
							</Link>
						))}
						<a
							href="/account"
							className="flex items-baseline gap-4 border-b border-line px-4 py-4 transition-colors hover:bg-panel"
						>
							<span className="font-readout text-[0.8rem] font-medium text-copper">
								{String(links.length + 1).padStart(2, "0")}
							</span>
							<span className="font-display text-[2rem] leading-[1.05] text-ink">Account</span>
						</a>
					</nav>
					<div aria-hidden="true" className="mx-4 mt-8">
						<div className="ruler" />
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
}
