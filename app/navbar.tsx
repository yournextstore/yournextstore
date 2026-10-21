"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type NavLink = {
	href: string;
	label: string;
	/** The bordered call-to-action at the end of the rail ("Build slots" in the original). */
	cta?: boolean;
};

export function Navbar({ links }: { links: NavLink[] }) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
				{links.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						className={cn(
							"max-w-[16ch] truncate rounded-[9px] px-[0.68rem] py-[0.45rem] text-[0.86rem] whitespace-nowrap transition-colors",
							link.cta
								? "border border-line text-ink hover:border-transparent hover:bg-led hover:text-led-ink"
								: "text-dim hover:bg-line-2 hover:text-ink",
						)}
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
						className="inline-flex rounded-[9px] p-2 text-dim transition-colors hover:bg-line-2 hover:text-ink lg:hidden"
					>
						<Menu className="h-5 w-5" aria-hidden="true" />
					</button>
				</SheetTrigger>
				<SheetContent
					side="right"
					hideClose
					className="block w-full gap-0 overflow-y-auto border-line bg-page p-0 sm:max-w-sm"
				>
					<div className="flex h-[68px] items-center justify-between border-b border-line px-5">
						<SheetTitle className="kicker text-[0.72rem]">Patch bay</SheetTitle>
						<SheetClose
							className="rounded-[9px] p-2 text-dim transition-colors hover:bg-line-2 hover:text-ink"
							aria-label="Close menu"
						>
							<X className="h-5 w-5" aria-hidden="true" />
						</SheetClose>
					</div>
					<div className="px-5 pt-5">
						<MobileSearchInput onNavigate={() => setOpen(false)} />
					</div>
					<nav aria-label="Mobile" className="mt-4 flex flex-col px-5">
						{[...links, { href: "/account", label: "Account" }].map((link, i) =>
							link.href === "/account" ? (
								<a
									key={link.href}
									href="/account"
									className="flex items-baseline gap-4 border-b border-line-2 py-[0.9rem] transition-colors hover:text-signal"
								>
									<Jack index={i} />
									<span className="font-display text-[1.6rem] text-ink">{link.label}</span>
								</a>
							) : (
								<Link
									key={link.href}
									href={link.href}
									onClick={() => setOpen(false)}
									className="flex items-baseline gap-4 border-b border-line-2 py-[0.9rem] transition-colors hover:text-signal"
								>
									<Jack index={i} />
									<span className="font-display text-[1.6rem] text-ink [overflow-wrap:anywhere]">
										{link.label}
									</span>
								</Link>
							),
						)}
					</nav>
					<p className="font-plate px-5 pt-6 pb-8 text-[0.7rem] text-faint">
						<span className="text-signal">▸ </span>every patch is one of one
					</p>
				</SheetContent>
			</Sheet>
		</>
	);
}

function Jack({ index }: { index: number }) {
	return (
		<span className="font-plate w-7 shrink-0 text-[0.7rem] text-signal" aria-hidden="true">
			{String(index + 1).padStart(2, "0")}
		</span>
	);
}
