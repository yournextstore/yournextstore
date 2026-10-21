"use client";

import { ChevronDown, CircleUserRound, House, Layers, Menu, Tag, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

export type NavLink = {
	href: string;
	label: string;
};

const NAV_LINK =
	"inline-flex min-h-8 items-center whitespace-nowrap text-navlink uppercase text-muted-foreground transition-colors hover:text-foreground";

/** How many categories sit in the bar before the rest fold into "More". */
const BAR_LIMIT = 4;

/** Desktop: centred, uppercase, widely tracked category links, as in the original's main nav. */
export function DesktopNav({ links }: { links: NavLink[] }) {
	const inline = links.slice(0, BAR_LIMIT);
	const more = links.slice(BAR_LIMIT);

	return (
		<nav aria-label="Main navigation" className="hidden items-center gap-7 xl:flex">
			{inline.map((link) => (
				<Link key={link.href} href={link.href} className={NAV_LINK}>
					{link.label}
				</Link>
			))}
			{more.length > 0 && (
				// Opens on hover and on keyboard focus, from CSS alone; the panel is small and anchored to
				// the button, so it cannot widen the page.
				<div className="group relative">
					<button type="button" aria-haspopup="true" className={`${NAV_LINK} gap-1.5`}>
						More
						<ChevronDown
							className="h-3.5 w-3.5 transition-transform duration-200 group-focus-within:rotate-180 group-hover:rotate-180"
							aria-hidden
						/>
					</button>
					<div className="invisible absolute top-full left-1/2 z-50 -translate-x-1/2 pt-3 opacity-0 transition-opacity duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
						<ul className="m-0 min-w-56 list-none rounded-lg border border-border bg-popover p-2 shadow-[0_6px_12px_rgba(0,0,0,0.15)]">
							{more.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="block rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-canvas hover:text-primary-hover"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}
		</nav>
	);
}

const DRAWER_LINK =
	"flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.8125rem] font-semibold text-foreground transition-colors hover:bg-canvas hover:text-primary-hover [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-muted-foreground";

const DRAWER_LABEL =
	"mb-2 block text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground";

/** Phones and tablets: the original's left drawer — welcome row, shop links, categories, account. */
export function Navbar({
	links,
	storeName,
	accountHref,
}: {
	links: NavLink[];
	storeName: string;
	accountHref: string;
}) {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button
					type="button"
					aria-label="Open menu"
					className="-ml-2.5 inline-flex h-11 w-11 items-center justify-center text-foreground xl:hidden"
				>
					<Menu className="h-5 w-5" strokeWidth={1.75} />
				</button>
			</SheetTrigger>
			<SheetContent
				side="left"
				hideClose
				className="w-full max-w-[300px] gap-0 border-border bg-card p-0 sm:max-w-[300px]"
			>
				<SheetDescription className="sr-only">Browse the store</SheetDescription>
				<div className="flex items-center justify-between border-b border-border px-5 py-4">
					<SheetTitle asChild>
						<Link href="/" onClick={close} className="ed-display truncate text-xl font-medium">
							{storeName}
						</Link>
					</SheetTitle>
					<SheetClose className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-muted text-foreground transition-colors hover:bg-border">
						<X className="h-4 w-4" />
						<span className="sr-only">Close menu</span>
					</SheetClose>
				</div>
				<div className="border-b border-border bg-canvas px-5 py-4">
					<span className={DRAWER_LABEL}>Welcome guest</span>
					{/* Plain <a>: /account is a proxied zone. */}
					<a
						href={accountHref}
						className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary-hover"
					>
						<CircleUserRound className="h-4 w-4" aria-hidden />
						Login / Register
					</a>
				</div>
				<div className="flex-1 space-y-6 overflow-y-auto px-5 py-4">
					<MobileSearchInput onNavigate={close} />
					<div>
						<span className={DRAWER_LABEL}>Shop &amp; explore</span>
						<ul className="m-0 flex list-none flex-col gap-1 p-0">
							<li>
								<Link href="/" onClick={close} className={DRAWER_LINK}>
									<House aria-hidden />
									Home
								</Link>
							</li>
							<li>
								<Link href="/products" onClick={close} className={DRAWER_LINK}>
									<Tag aria-hidden />
									All products
								</Link>
							</li>
						</ul>
					</div>
					{links.length > 0 && (
						<div>
							<span className={DRAWER_LABEL}>Quick links</span>
							<ul className="m-0 flex list-none flex-col gap-1 p-0">
								{links.map((link) => (
									<li key={link.href}>
										<Link href={link.href} onClick={close} className={DRAWER_LINK}>
											<Layers aria-hidden />
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					)}
					<div>
						<span className={DRAWER_LABEL}>My account</span>
						<ul className="m-0 flex list-none flex-col gap-1 p-0">
							<li>
								<a href={accountHref} className={DRAWER_LINK}>
									<CircleUserRound aria-hidden />
									Profile &amp; orders
								</a>
							</li>
						</ul>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
