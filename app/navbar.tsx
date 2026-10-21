"use client";

import { Dialog } from "@base-ui/react/dialog";
import { HeartHandshakeIcon, MenuIcon, UserRoundIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeButton } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export type NavLink = {
	href: string;
	label: string;
};

const isActive = (pathname: string | null, href: string) =>
	pathname !== null && (href === "/" ? pathname === "/" : pathname.startsWith(href));

/**
 * The hairline strip under the wordmark. Categories outnumber the original's four links,
 * so the row scrolls sideways when it doesn't fit and centres when it does.
 */
export function CategoryStrip({ links, pathname = null }: { links: NavLink[]; pathname?: string | null }) {
	return (
		<nav aria-label="Categories" className="hidden border-t border-line sm:block">
			<div className="no-scrollbar overflow-x-auto">
				<ul className="mx-auto flex w-max gap-8 px-5 text-[14px] tracking-wide text-muted-foreground">
					{links.map((link) => {
						const active = isActive(pathname, link.href);
						return (
							<li key={link.href}>
								<Link
									href={link.href}
									aria-current={active ? "page" : undefined}
									className={cn(
										"block whitespace-nowrap py-3 decoration-brand underline-offset-[16.5px] hover:text-ink hover:underline",
										active && "text-ink underline",
									)}
								>
									{link.label}
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
		</nav>
	);
}

/** Reads the pathname for the active underline, so it sits in its own Suspense boundary. */
export function ActiveCategoryStrip({ links }: { links: NavLink[] }) {
	const pathname = usePathname();
	return <CategoryStrip links={links} pathname={pathname} />;
}

/** The original's menu: a fullscreen editorial takeover, not a side drawer. */
export function FullscreenMenu({
	storeName,
	shelf,
	pages,
	accountHref,
}: {
	storeName: string;
	shelf: NavLink[];
	pages: NavLink[];
	accountHref: string;
}) {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);
	const big = [{ href: "/", label: "Home" }, { href: "/products", label: "Shop all" }, ...shelf];
	const utility =
		"flex items-center gap-2 text-[16px] text-muted-foreground underline-offset-4 hover:text-ink hover:underline";

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger
				aria-label="Open menu"
				className="inline-flex size-10 items-center justify-center text-muted-foreground transition-colors hover:bg-tile hover:text-ink"
			>
				<MenuIcon aria-hidden className="size-5" strokeWidth={1.8} />
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Popup className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-paper text-ink transition-[opacity,translate] duration-300 data-ending-style:-translate-y-3 data-ending-style:opacity-0 data-starting-style:-translate-y-3 data-starting-style:opacity-0">
					<Dialog.Description className="sr-only">Site navigation</Dialog.Description>
					<div className="border-b border-line">
						<div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5">
							<Dialog.Title className="truncate font-display text-[26px] font-medium tracking-[0.04em]">
								{storeName}
							</Dialog.Title>
							<Dialog.Close
								aria-label="Close menu"
								className="inline-flex size-11 shrink-0 items-center justify-center bg-tile text-muted-foreground transition-colors hover:text-ink"
							>
								<XIcon aria-hidden className="size-6" strokeWidth={1.5} />
							</Dialog.Close>
						</div>
					</div>
					<div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-7 gap-y-2 px-5 pt-4">
						<a href={accountHref} className={utility}>
							<UserRoundIcon aria-hidden className="size-[15px]" strokeWidth={1.8} />
							Account
						</a>
						<Link href="/about" onClick={close} className={utility}>
							<HeartHandshakeIcon aria-hidden className="size-[15px]" strokeWidth={1.8} />
							Our story
						</Link>
						<ThemeButton withLabel className={utility} />
					</div>
					<nav
						aria-label="Menu"
						className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col overflow-y-auto px-5 py-6"
					>
						{/* my-auto centres the list when it fits and lets it scroll from the top when it doesn't. */}
						<div className="my-auto flex flex-col gap-1">
							{big.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									onClick={close}
									className="group flex items-baseline gap-4 border-b border-line py-3 font-display text-[clamp(26px,4.5vh,44px)] leading-tight hover:text-brand-ink"
								>
									{link.label}
									<span
										aria-hidden
										className="font-sans text-[15px] text-muted-foreground opacity-0 transition group-hover:opacity-100"
									>
										→
									</span>
								</Link>
							))}
							<div className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
								{pages.map((link) => (
									<Link
										key={link.href}
										href={link.href}
										onClick={close}
										className="text-[16px] text-muted-foreground underline-offset-4 hover:text-ink hover:underline"
									>
										{link.label}
									</Link>
								))}
							</div>
						</div>
					</nav>
					<p className="mx-auto w-full max-w-6xl border-t border-line px-5 py-5 text-small text-muted-foreground">
						{storeName} · Secure checkout
					</p>
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
