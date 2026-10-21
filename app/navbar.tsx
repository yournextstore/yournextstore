"use client";

import Link from "next/link";
import { useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type NavLink = {
	href: string;
	label: string;
};

/** Desktop: white links in the black bar. */
export function NavLinks({ links }: { links: NavLink[] }) {
	return (
		<nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
			{links.map((link) => (
				<Link
					key={link.href}
					href={link.href}
					className="whitespace-nowrap text-sm font-semibold text-ink-foreground transition-opacity hover:opacity-75"
				>
					{link.label}
				</Link>
			))}
		</nav>
	);
}

function Bars() {
	return (
		<span aria-hidden className="flex flex-col items-end gap-[6px]">
			<span className="h-[3px] w-7 rounded-full bg-current" />
			<span className="h-[3px] w-[22px] rounded-full bg-current" />
			<span className="h-[3px] w-7 rounded-full bg-current" />
		</span>
	);
}

/**
 * Phones and tablets: the original's three-bar toggle opens a full-screen white panel with the
 * navigation stacked top-left and a black cross where the bars were.
 */
export function MobileMenu({ links, categories }: { links: NavLink[]; categories: NavLink[] }) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button
					type="button"
					aria-label="Open menu"
					className="-mr-2 flex size-11 items-center justify-center text-ink-foreground lg:hidden"
				>
					<Bars />
				</button>
			</SheetTrigger>
			<SheetContent
				side="right"
				hideClose
				aria-describedby={undefined}
				className="inset-0 h-dvh w-full max-w-none gap-0 overflow-y-auto border-0 bg-white p-0 shadow-none sm:max-w-none"
			>
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<div className="shell flex h-20 shrink-0 items-center justify-end">
					<SheetClose
						aria-label="Close menu"
						className="-mr-2 flex size-11 items-center justify-center text-foreground"
					>
						<svg aria-hidden viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor">
							<path d="M4 4l16 16M20 4L4 20" strokeWidth="2.5" strokeLinecap="round" />
						</svg>
					</SheetClose>
				</div>
				<nav aria-label="Menu" className="shell flex flex-col items-start gap-8 pb-16 pt-6">
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							onClick={() => setOpen(false)}
							className="text-sm font-semibold text-foreground"
						>
							{link.label}
						</Link>
					))}
					{categories.length > 0 ? (
						<div className="w-full border-t border-border pt-8">
							<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Categories
							</p>
							<ul className="mt-5 flex flex-col gap-5">
								{categories.map((category) => (
									<li key={category.href}>
										<Link
											href={category.href}
											onClick={() => setOpen(false)}
											className="text-sm font-medium text-foreground"
										>
											{category.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					) : null}
				</nav>
			</SheetContent>
		</Sheet>
	);
}
