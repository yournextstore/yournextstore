"use client";

import Link from "next/link";
import { useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type NavLink = {
	href: string;
	label: string;
};

export type NavGroup = {
	title: string;
	links: NavLink[];
};

/** The three-bar icon of the original: plain strokes, 24px wide. */
function Burger() {
	return (
		<svg aria-hidden="true" viewBox="0 0 28 22" className="h-[22px] w-7" fill="none">
			<path d="M1.5 2h25M1.5 11h25M1.5 20h25" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
		</svg>
	);
}

function Cross() {
	return (
		<svg aria-hidden="true" viewBox="0 0 28 28" className="size-7" fill="none">
			<path d="M3 3l22 22M25 3L3 25" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
		</svg>
	);
}

/**
 * FRNTR's menu: a burger that opens a quiet full-screen sheet with the links centred in bold.
 * The desktop bar keeps the primary links inline beside the wordmark as well.
 */
export function Navbar({ links, groups }: { links: NavLink[]; groups: NavGroup[] }) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				aria-label="Open menu"
				className="flex size-11 shrink-0 items-center justify-center text-foreground"
			>
				<Burger />
			</SheetTrigger>
			<SheetContent
				side="top"
				showCloseButton={false}
				className="gap-0 overflow-y-auto border-0 bg-[#fafafa] px-6 pt-4 pb-12 shadow-none data-[side=top]:h-dvh data-[side=top]:border-b-0"
			>
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<div className="flex justify-end lg:frame lg:justify-start lg:pt-4">
					<SheetClose aria-label="Close menu" className="flex size-11 items-center justify-center">
						<Cross />
					</SheetClose>
				</div>
				<nav aria-label="Menu" className="mx-auto mt-6 flex w-full max-w-3xl flex-col items-center">
					<ul className="flex flex-col items-center gap-2">
						{links.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									onClick={() => setOpen(false)}
									className="block px-2 py-1 font-nav text-2xl font-bold text-foreground hover:underline"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
					{groups
						.filter((group) => group.links.length > 0)
						.map((group) => (
							<div key={group.title} className="mt-10 flex flex-col items-center">
								<p className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
									{group.title}
								</p>
								<ul className="mt-3 flex flex-wrap justify-center gap-2">
									{group.links.map((link) => (
										<li key={link.href}>
											<Link
												href={link.href}
												onClick={() => setOpen(false)}
												className="block rounded-xs bg-peach px-4 py-2 text-sm font-bold text-foreground transition-colors hover:bg-pink"
											>
												{link.label}
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
				</nav>
			</SheetContent>
		</Sheet>
	);
}

export function DesktopNav({ links }: { links: NavLink[] }) {
	return (
		<nav aria-label="Primary" className="hidden items-center gap-2 lg:flex">
			{links.map((link) => (
				<Link
					key={link.href}
					href={link.href}
					className="p-2.5 font-nav text-lg font-semibold whitespace-nowrap text-foreground hover:underline"
				>
					{link.label}
				</Link>
			))}
		</nav>
	);
}
