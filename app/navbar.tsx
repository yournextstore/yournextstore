"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export type NavLink = {
	href: string;
	label: string;
};

/**
 * Centre links (lg+), bordered on hover as in the original. No current-page state: reading the
 * pathname here would take the header out of the prerendered shell.
 */
export function NavLinks({ links }: { links: NavLink[] }) {
	return (
		<div className="hidden min-w-0 items-center justify-center gap-2 text-[14px] font-medium lg:flex">
			{links.map((link) => (
				<Link
					key={link.href}
					href={link.href}
					className={cn(
						"whitespace-nowrap rounded-md border border-transparent px-3.5 py-1.5 transition hover:border-current",
					)}
				>
					{link.label}
				</Link>
			))}
		</div>
	);
}

/** Hamburger + the fullscreen menu: an editorial takeover that fades down from the header. */
export function Navbar({
	links,
	storeName,
	accountHref,
	contactEnabled,
	year,
}: {
	links: NavLink[];
	storeName: string;
	accountHref: string;
	contactEnabled: boolean;
	year: number;
}) {
	const [open, setOpen] = useState(false);
	// Read when the menu opens, not during render: the header stays in the prerendered shell.
	const [pathname, setPathname] = useState("");
	const onOpenChange = (next: boolean) => {
		if (next) setPathname(window.location.pathname);
		setOpen(next);
	};
	const close = () => setOpen(false);
	const isActive = (href: string) =>
		pathname !== "" && (href === "/" ? pathname === "/" : pathname.startsWith(href));

	const pages = [
		{ href: "/about", label: "About" },
		{ href: "/faq", label: "FAQ" },
		...(contactEnabled ? [{ href: "/contact", label: "Contact" }] : []),
		{ href: "/search", label: "Search" },
	];

	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Trigger asChild>
				<button
					type="button"
					aria-label="Open menu"
					className="rounded-md p-2.5 transition hover:bg-current/10"
				>
					<svg
						aria-hidden
						width="20"
						height="20"
						viewBox="0 0 20 20"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.8"
						strokeLinecap="round"
					>
						<path d="M3 5.5h14M3 10h14M3 14.5h14" />
					</svg>
				</button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Content className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-background text-foreground data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-3 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-3 data-[state=open]:duration-300">
					<Dialog.Description className="sr-only">Site navigation</Dialog.Description>
					<div className="border-b border-border">
						<div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
							<Dialog.Title className="font-display text-[26px] font-medium tracking-[0.04em]">
								{storeName}
							</Dialog.Title>
							<Dialog.Close
								className="p-2 text-muted-foreground transition hover:bg-card hover:text-foreground"
								aria-label="Close menu"
							>
								<svg
									aria-hidden
									width="26"
									height="26"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
								>
									<path d="M6 6l12 12M18 6L6 18" />
								</svg>
							</Dialog.Close>
						</div>
					</div>
					{/* Utility row under the header line: account / theme, icon + label. */}
					<div className="mx-auto flex w-full max-w-6xl items-center gap-x-7 px-5 pt-4">
						<a
							href={accountHref}
							className="flex items-center gap-2 text-[16px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
						>
							<svg
								aria-hidden
								width="15"
								height="15"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.8"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<circle cx="12" cy="8" r="4" />
								<path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
							</svg>
							Account
						</a>
						<ThemeToggle withLabel />
					</div>
					<nav
						aria-label="Menu"
						className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-1 overflow-y-auto px-5 py-6"
					>
						{[{ href: "/", label: "Home" }, ...links].map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={close}
								className={cn(
									"group flex items-baseline gap-4 border-b border-border py-3 font-display text-[clamp(28px,5vh,44px)] leading-tight transition-colors hover:text-brass",
									isActive(link.href) && "text-brass",
								)}
							>
								<span className="min-w-0 break-words">{link.label}</span>
								<span
									aria-hidden
									className="text-[15px] text-muted-foreground opacity-0 transition group-hover:opacity-100"
								>
									→
								</span>
							</Link>
						))}
						<div className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
							{pages.map((page) => (
								<Link
									key={page.href}
									href={page.href}
									onClick={close}
									className={cn(
										"text-[16px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline",
										isActive(page.href) && "text-foreground underline",
									)}
								>
									{page.label}
								</Link>
							))}
						</div>
					</nav>
					<p className="mx-auto w-full max-w-6xl border-t border-border px-5 py-5 text-[13px] text-muted-foreground">
						&copy; {year} {storeName}
					</p>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
