"use client";

import { Menu, UserRound, X } from "lucide-react";
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
import type { ShopSection } from "@/lib/catalog";
import { YNSMedia } from "@/lib/yns-media";

export type MenuSection = Pick<ShopSection, "name" | "href" | "count" | "image">;

/** Phones and tablets: a full-screen menu sheet with the sections in condensed type. */
export function MobileMenu({
	storeName,
	sections,
	sectionSize,
	accountHref,
	helpLinks,
}: {
	storeName: string;
	sections: MenuSection[];
	/** One condensed size for every row, so the longest name fits beside its count. */
	sectionSize: string;
	accountHref: string;
	helpLinks: { href: string; label: string }[];
}) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				aria-label="Open navigation menu"
				className="press grid size-11 place-items-center rounded-full hover:bg-wash"
			>
				<Menu className="size-5" strokeWidth={1.8} aria-hidden="true" />
			</SheetTrigger>
			<SheetContent
				side="top"
				showCloseButton={false}
				className="gap-0 overflow-y-auto overscroll-contain bg-background shadow-none data-[side=top]:h-dvh data-[side=top]:border-0"
			>
				<nav aria-label="Menu" className="flex min-h-full flex-col gap-[22px] px-4 pb-6">
					<div className="-mr-3 flex h-14 shrink-0 items-center justify-between">
						<SheetClose
							nativeButton={false}
							render={<Link href="/" className="truncate font-display text-[26px] leading-none" />}
						>
							{storeName}
						</SheetClose>
						<SheetTitle className="sr-only">Menu</SheetTitle>
						<SheetDescription className="sr-only">Browse the store, your account and help.</SheetDescription>
						<SheetClose
							aria-label="Close menu"
							className="press grid size-11 shrink-0 place-items-center rounded-full hover:bg-wash"
						>
							<X className="size-5" strokeWidth={1.8} aria-hidden="true" />
						</SheetClose>
					</div>

					<MobileSearchInput onNavigate={() => setOpen(false)} />

					<ul className="flex flex-col">
						{sections.map((section) => (
							<li key={section.href} className="border-b border-line">
								<SheetClose
									nativeButton={false}
									render={
										<Link
											href={section.href}
											className="flex min-h-[72px] items-center justify-between gap-3 py-2"
										/>
									}
								>
									<span
										style={{ fontSize: sectionSize }}
										className="min-w-0 whitespace-nowrap font-display leading-[0.9]"
									>
										{section.name}
									</span>
									<span className="flex shrink-0 items-center gap-3 text-sm tabular-nums">
										<span>{String(section.count).padStart(2, "0")}</span>
										<span className="relative h-14 w-11 overflow-hidden rounded-[10px] bg-photo">
											{section.image ? (
												<YNSMedia src={section.image} alt="" fill sizes="44px" className="object-cover" />
											) : null}
										</span>
									</span>
								</SheetClose>
							</li>
						))}
					</ul>

					<div className="grid grid-cols-2 gap-2">
						{/* Plain <a>: /account is a proxied zone. */}
						<a
							href={accountHref}
							className="press flex h-[52px] items-center justify-center gap-2 rounded-full bg-foreground font-semibold text-background"
						>
							<UserRound className="size-4" aria-hidden="true" />
							Account
						</a>
						<SheetClose
							nativeButton={false}
							render={
								<Link
									href="/about"
									className="press grid h-[52px] place-items-center rounded-full border border-foreground font-medium"
								/>
							}
						>
							Our story
						</SheetClose>
					</div>

					<div className="mt-auto flex flex-wrap gap-x-3.5 border-t border-line pt-4 text-sm">
						{helpLinks.map((link) => (
							<SheetClose
								key={link.href}
								nativeButton={false}
								render={<Link href={link.href} className="py-2" />}
							>
								{link.label}
							</SheetClose>
						))}
					</div>
				</nav>
			</SheetContent>
		</Sheet>
	);
}
