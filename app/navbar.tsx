"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";

export type NavLink = {
	href: string;
	label: string;
};

/** Desktop links: uppercase, centred in the header (xl+; data-driven links outgrow lg). */
export function Navbar({ links }: { links: NavLink[] }) {
	return (
		<nav
			aria-label="Main"
			className="hidden items-center gap-8 xl:absolute xl:left-1/2 xl:top-1/2 xl:flex xl:-translate-x-1/2 xl:-translate-y-1/2"
		>
			{links.map((link) => (
				<Link
					key={link.href}
					href={link.href}
					className="whitespace-nowrap text-sm/6 uppercase text-foreground transition-colors hover:text-muted-foreground"
				>
					{link.label}
				</Link>
			))}
		</nav>
	);
}

/**
 * Mobile menu: the original drops a panel from under the header (links, a rule, account)
 * rather than sliding a drawer in from the side.
 */
export function MobileMenu({ links, accountHref }: { links: NavLink[]; accountHref: string }) {
	const [open, setOpen] = useState(false);
	const panelId = useId();

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open]);

	return (
		<>
			<button
				type="button"
				aria-label={open ? "Close menu" : "Open menu"}
				aria-expanded={open}
				aria-controls={panelId}
				onClick={() => setOpen((o) => !o)}
				className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-secondary xl:hidden"
			>
				{open ? <X className="h-6 w-6" strokeWidth={1.5} /> : <Menu className="h-6 w-6" strokeWidth={1.5} />}
			</button>
			<div
				id={panelId}
				hidden={!open}
				className="absolute inset-x-0 top-full border-b border-border bg-background shadow-[0_12px_24px_-12px_rgb(0_0_0/0.15)] xl:hidden"
			>
				<div className="shell py-4">
					<MobileSearchInput onNavigate={() => setOpen(false)} />
					<nav aria-label="Mobile" className="mt-2 flex flex-col">
						{links.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={() => setOpen(false)}
								className="py-2.5 text-sm/6 uppercase text-foreground transition-colors hover:text-muted-foreground"
							>
								{link.label}
							</Link>
						))}
					</nav>
					<div className="mt-3 border-t border-border pt-4">
						<a href={accountHref} className="flex items-center gap-3 py-1 text-sm/6 uppercase">
							<svg
								aria-hidden="true"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								className="h-6 w-6"
							>
								<circle cx="12" cy="12" r="9.25" />
								<circle cx="12" cy="10" r="3.25" />
								<path d="M6.2 18.4c1.3-2.1 3.4-3.2 5.8-3.2s4.5 1.1 5.8 3.2" strokeLinecap="round" />
							</svg>
							Account
						</a>
					</div>
				</div>
			</div>
		</>
	);
}
