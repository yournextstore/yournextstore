"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type NavLink = {
	href: string;
	label: string;
};

/** Desktop: small centred links. Below lg: a right-hand sheet with the links set in the display serif. */
export function Navbar({
	links,
	categories,
	storeName,
	accountHref,
}: {
	links: NavLink[];
	categories: NavLink[];
	storeName: string;
	accountHref: string;
}) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<ul className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 lg:flex">
				{links.map((link) => (
					<li key={link.href}>
						<Link
							href={link.href}
							className="text-[11px] font-medium tracking-[0.04em] whitespace-nowrap text-foreground transition-colors hover:text-muted-foreground"
						>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger
					aria-label="Open menu"
					className="flex h-9 w-9 items-center justify-center text-foreground transition-colors hover:text-muted-foreground lg:hidden"
				>
					<Menu className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
				</SheetTrigger>
				<SheetContent
					side="right"
					showCloseButton={false}
					className="block overflow-y-auto bg-background px-6 py-8 data-[side=right]:w-72 data-[side=right]:sm:max-w-xs"
				>
					<div className="flex items-start justify-between gap-4">
						<SheetTitle className="min-w-0 text-xl font-medium tracking-[0.16em] uppercase wrap-break-word">
							{storeName}
						</SheetTitle>
						<button
							type="button"
							onClick={() => setOpen(false)}
							aria-label="Close menu"
							className="-mt-1 -mr-2 flex h-9 w-9 shrink-0 items-center justify-center text-foreground hover:text-muted-foreground"
						>
							<X className="h-4 w-4" aria-hidden="true" />
						</button>
					</div>
					<SheetDescription className="sr-only">Site navigation</SheetDescription>
					<nav aria-label="Main" className="mt-8 flex flex-col gap-6">
						{links.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={() => setOpen(false)}
								className="font-display text-3xl tracking-tight transition-colors hover:text-muted-foreground"
							>
								{link.label}
							</Link>
						))}
					</nav>
					{categories.length > 0 && (
						<div className="mt-10 border-t pt-6">
							<p className="eyebrow text-muted-foreground">Shop by category</p>
							<ul className="mt-3 flex flex-col">
								{categories.map((category) => (
									<li key={category.href}>
										<Link
											href={category.href}
											onClick={() => setOpen(false)}
											className="flex min-h-10 items-center text-sm transition-colors hover:text-muted-foreground"
										>
											{category.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					)}
					<div className="mt-6 flex items-center justify-between border-t pt-6">
						{/* Plain <a>: /account is a proxied zone (see AGENTS.md). */}
						<a href={accountHref} className="flex min-h-10 items-center text-sm hover:text-muted-foreground">
							Your account
						</a>
						<ThemeToggle className="-mr-2" />
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
}
