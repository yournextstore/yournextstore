"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type NavLink = {
	href: string;
	label: string;
};

const linkClass =
	"block rounded-lg px-3 py-2.5 text-left text-base text-ink-soft transition-colors hover:bg-wash hover:text-ink";

/**
 * Hamburger menu on every breakpoint. Below md the panel drops under the header and fills the
 * screen (the bar stays visible, the burger morphs into a cross); from md it is a left drawer
 * with its own "Menu" title row.
 */
export function Navbar({
	links,
	secondary,
	accountHref,
}: {
	links: NavLink[];
	secondary: NavLink[];
	accountHref: string;
}) {
	const [open, setOpen] = useState(false);
	const [hasInteracted, setHasInteracted] = useState(false);

	const anim = (opened: string, closed: string) => (hasInteracted ? (open ? opened : closed) : "");

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<Button
				variant="ghost"
				size="icon-lg"
				onClick={() => {
					setHasInteracted(true);
					setOpen(!open);
				}}
				aria-label={open ? "Close menu" : "Open menu"}
				aria-expanded={open}
				className="relative z-[60] -ml-2.5 aria-expanded:bg-transparent"
			>
				<span className="relative block h-5 w-5" aria-hidden>
					<span
						className={cn(
							"absolute inset-x-0 top-[2px] h-0.5 rounded-full bg-current",
							anim("animate-burger-top-open", "animate-burger-top-close"),
						)}
					/>
					<span
						className={cn(
							"absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-current",
							anim("animate-burger-mid-open", "animate-burger-mid-close"),
						)}
						style={hasInteracted && !open ? { animationDelay: "0.2s", opacity: 0 } : undefined}
					/>
					<span
						className={cn(
							"absolute inset-x-0 bottom-[2px] h-0.5 rounded-full bg-current",
							anim("animate-burger-bottom-open", "animate-burger-bottom-close"),
						)}
					/>
				</span>
			</Button>

			<SheetContent
				side="left"
				hideClose
				aria-describedby={undefined}
				className="gap-0 rounded-none p-0 max-md:top-16 max-md:h-[calc(100%-4rem)] max-md:w-full max-md:max-w-none max-md:border-r-0 max-md:shadow-none"
				overlayClassName="bg-black/10 max-md:top-16 max-md:bg-transparent"
			>
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<div className="hidden h-16 shrink-0 items-center justify-between border-b border-border px-4 md:flex">
					<span className="text-base font-semibold">Menu</span>
					<SheetClose asChild>
						<Button variant="ghost" size="icon-sm" aria-label="Close menu">
							<X className="size-4" aria-hidden />
						</Button>
					</SheetClose>
				</div>
				<nav aria-label="Main" className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 pt-2 pb-6">
					{links.map((link) => (
						<Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={linkClass}>
							{link.label}
						</Link>
					))}
					<div className="mt-2 border-t border-border pt-2">
						{secondary.map((link) => (
							<Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={linkClass}>
								{link.label}
							</Link>
						))}
						{/* Plain <a>: /account is a proxied zone (see AGENTS.md). */}
						<a href={accountHref} className={linkClass}>
							My Account
						</a>
					</div>
				</nav>
			</SheetContent>
		</Sheet>
	);
}
