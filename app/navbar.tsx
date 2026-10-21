"use client";

import Link from "next/link";
import { useState } from "react";
import { FinishSwitch } from "@/components/finish-switch";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { NavLink } from "@/lib/catalog";

/** Desktop: the original's centred row of spaced small caps. */
export function Navbar({ links }: { links: NavLink[] }) {
	return (
		<nav
			aria-label="Main"
			className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-7 lg:flex xl:gap-10"
		>
			{links.map((link) => (
				<Link
					key={link.href}
					href={link.href}
					className="whitespace-nowrap text-[12px] font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
				>
					{link.label}
				</Link>
			))}
		</nav>
	);
}

/** Below lg the original simply dropped its anchors; a shop needs them, so they open as a full-height curtain. */
export function MobileMenu({ links, accountHref }: { links: NavLink[]; accountHref: string }) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				aria-label="Open menu"
				className="inline-flex size-10 flex-col items-center justify-center gap-[5px] lg:hidden"
			>
				<span className="block h-px w-5 bg-foreground" />
				<span className="block h-px w-5 bg-foreground" />
			</SheetTrigger>
			<SheetContent
				side="right"
				className="block overflow-y-auto border-hairline-strong px-6 pb-10 pt-20 data-[side=right]:w-full data-[side=right]:sm:max-w-md"
			>
				<SheetTitle className="kicker">Menu</SheetTitle>
				<SheetDescription className="sr-only">Browse the shop</SheetDescription>
				<div className="mt-6">
					<MobileSearchInput onNavigate={() => setOpen(false)} />
				</div>
				<nav aria-label="Mobile" className="mt-8 flex flex-col border-t border-hairline">
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							onClick={() => setOpen(false)}
							className="border-b border-hairline py-4 font-display text-4xl font-light tracking-[-0.02em] text-ink transition-colors hover:text-warm"
						>
							{link.label}
						</Link>
					))}
					{/* Plain <a>: /account is a proxied zone. */}
					<a
						href={accountHref}
						className="border-b border-hairline py-4 font-display text-4xl font-light tracking-[-0.02em] text-ink transition-colors hover:text-warm"
					>
						Account
					</a>
				</nav>
				<div className="mt-10">
					<FinishSwitch />
				</div>
			</SheetContent>
		</Sheet>
	);
}
