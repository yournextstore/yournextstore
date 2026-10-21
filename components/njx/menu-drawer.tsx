"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandMark } from "@/components/njx/brand-mark";
import { AccountIcon, CloseIcon, MenuIcon } from "@/components/njx/icons";
import { ThemeSwitch } from "@/components/njx/theme-switch";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

export type MenuLinks = {
	collections: { href: string; label: string }[];
	pages: { href: string; label: string }[];
	footer: { href: string; label: string }[];
};

const rowClass =
	"block rounded-md px-3 py-3 hover:bg-tile aria-[current=page]:bg-tile aria-[current=page]:font-semibold";

export function MenuDrawer({
	storeName,
	letter,
	links,
	accountHref,
}: {
	storeName: string;
	letter: string;
	links: MenuLinks;
	accountHref: string;
}) {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				aria-label="Open menu"
				className="rounded-md p-2 text-muted-foreground hover:bg-tile hover:text-ink sm:p-2.5"
			>
				<MenuIcon />
			</SheetTrigger>
			<SheetContent
				showCloseButton={false}
				className="gap-0 overflow-hidden rounded-2xl border border-line bg-paper p-0 shadow-2xl data-[side=right]:inset-y-4 data-[side=right]:right-4 data-[side=right]:h-auto data-[side=right]:w-[calc(100%-2rem)] data-[side=right]:border data-[side=right]:sm:max-w-sm"
			>
				<div className="flex items-center justify-between gap-2 border-b border-line px-4 py-4">
					<SheetTitle className="flex min-w-0 items-center gap-2 font-display text-xl font-bold">
						<BrandMark letter={letter} className="h-7 w-7 rounded-md text-[16px]" />
						<span className="truncate">{storeName}</span>
					</SheetTitle>
					<SheetDescription className="sr-only">Site navigation</SheetDescription>
					<div className="flex shrink-0 items-center gap-0.5">
						<a
							href={accountHref}
							className="rounded-md p-2 text-muted-foreground hover:bg-tile hover:text-ink"
							aria-label="Account"
						>
							<AccountIcon size={18} />
						</a>
						<ThemeSwitch size={18} className="p-2" />
						<SheetClose
							className="rounded-md p-2 text-muted-foreground hover:bg-tile hover:text-ink"
							aria-label="Close menu"
						>
							<CloseIcon size={18} />
						</SheetClose>
					</div>
				</div>
				<nav aria-label="Menu" className="flex-1 overflow-y-auto px-4 py-4 text-[16px] font-medium">
					<Link href="/" data-nav-link onClick={close} className={rowClass}>
						Home
					</Link>
					{links.collections.length > 0 ? (
						<div className="mb-1 ml-3 border-l border-line pl-3">
							{links.collections.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									data-nav-link
									onClick={close}
									className="block rounded-md px-3 py-2.5 text-[15px] text-muted-foreground hover:bg-tile hover:text-ink aria-[current=page]:bg-tile aria-[current=page]:text-ink"
								>
									{link.label}
								</Link>
							))}
						</div>
					) : null}
					{links.pages.map((link) => (
						<Link key={link.href} href={link.href} data-nav-link onClick={close} className={rowClass}>
							{link.label}
						</Link>
					))}
				</nav>
				<div className="border-t border-line px-6 py-5 text-[13px] text-muted-foreground">
					{links.footer.map((link, index) => (
						<span key={link.href}>
							{index > 0 ? " · " : null}
							<Link href={link.href} onClick={close} className="underline underline-offset-2 hover:text-ink">
								{link.label}
							</Link>
						</span>
					))}
				</div>
			</SheetContent>
		</Sheet>
	);
}
