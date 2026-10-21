"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/app/cart/cart-context";
import { cn } from "@/lib/utils";

export type NavLink = {
	href: string;
	label: string;
};

/**
 * Centre links (lg+): wide-tracked uppercase with a hairline box on hover, as in the original.
 * No current-page state: reading the pathname here would take the header out of the shell.
 */
export function NavLinks({ links }: { links: NavLink[] }) {
	return (
		<div className="hidden min-w-0 items-center justify-center gap-1.5 lg:flex">
			{links.map((link) => (
				<Link
					key={link.href}
					href={link.href}
					className="whitespace-nowrap border border-transparent px-3.5 py-[7px] text-[13px] font-medium uppercase tracking-[0.18em] transition hover:border-current"
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
	collections,
	storeName,
	accountHref,
	contactEnabled,
	year,
}: {
	links: NavLink[];
	collections: NavLink[];
	storeName: string;
	accountHref: string;
	contactEnabled: boolean;
	year: number;
}) {
	const [open, setOpen] = useState(false);
	const { openCart } = useCart();
	// Read when the menu opens, not during render: the header stays in the prerendered shell.
	const [pathname, setPathname] = useState("");
	const onOpenChange = (next: boolean) => {
		if (next) setPathname(window.location.pathname);
		setOpen(next);
	};
	const close = () => setOpen(false);
	const isActive = (href: string) =>
		pathname !== "" && (href === "/" ? pathname === "/" : pathname.startsWith(href));

	const big = [{ href: "/", label: "Home" }, { href: "/products", label: "Shop all" }, ...links];
	const small = [
		...collections,
		{ href: "/about", label: "About" },
		{ href: "/faq", label: "FAQ" },
		...(contactEnabled ? [{ href: "/contact", label: "Contact" }] : []),
	];
	const utility =
		"flex items-center gap-2 text-[16px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline";

	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Trigger asChild>
				<button
					type="button"
					aria-label="Open menu"
					className="grid h-10 w-10 place-items-center border border-transparent transition hover:border-current"
				>
					<svg
						aria-hidden
						width="20"
						height="20"
						viewBox="0 0 20 20"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.6"
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
						<div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5">
							<Dialog.Title className="flex min-w-0 items-center gap-2.5 text-[22px] font-bold uppercase tracking-[0.32em]">
								<span
									aria-hidden
									className="flex h-8 w-8 shrink-0 items-center justify-center bg-white text-[18px] tracking-normal text-[#0a0a0a]"
								>
									{storeName.charAt(0).toUpperCase()}
								</span>
								<span className="truncate">{storeName}</span>
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
					{/* Utility row under the header line: account / cart, icon + label. */}
					<div className="mx-auto flex w-full max-w-6xl items-center gap-x-7 px-5 pt-4">
						<a href={accountHref} className={utility}>
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
						<button
							type="button"
							className={utility}
							onClick={() => {
								close();
								openCart();
							}}
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
								<circle cx="9" cy="21" r="1.4" />
								<circle cx="19" cy="21" r="1.4" />
								<path d="M2.5 3h2l2.6 12.6a2 2 0 0 0 2 1.6h9.2a2 2 0 0 0 2-1.6L22 7H6" />
							</svg>
							Cart
						</button>
					</div>
					<nav
						aria-label="Menu"
						className="mx-auto flex w-full max-w-6xl flex-1 flex-col overflow-y-auto px-5"
					>
						<div className="my-auto flex flex-col gap-1 py-6">
							{big.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									onClick={close}
									aria-current={isActive(link.href) ? "page" : undefined}
									className="menu-link group flex items-baseline gap-4 self-start py-2.5 font-display text-[clamp(22px,7vw,44px)] uppercase leading-tight tracking-[0.06em]"
								>
									<span className="min-w-0 break-words">{link.label}</span>
									<span
										aria-hidden
										className="-translate-x-2 text-[22px] text-muted-foreground opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-aria-[current=page]:translate-x-0 group-aria-[current=page]:opacity-100"
									>
										→
									</span>
								</Link>
							))}
						</div>
						<div className="flex flex-wrap gap-x-8 gap-y-2 pb-5">
							{small.map((page) => (
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
