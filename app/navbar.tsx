"use client";

import { ChevronRightIcon, MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import type { CatalogLink } from "@/lib/catalog";

/** The original's full-screen mobile menu: "MENU" bar, then every category as an uppercase row. */
export function MobileMenu({
	categories,
	collections,
	pages,
}: {
	categories: CatalogLink[];
	collections: CatalogLink[];
	pages: CatalogLink[];
}) {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);

	const row = (link: CatalogLink, chevron = true) => (
		<li key={link.href}>
			<Link
				href={link.href}
				onClick={close}
				className="flex items-center justify-between px-4 py-3 text-label uppercase transition-colors hover:bg-tonal"
			>
				{link.label}
				{chevron && <ChevronRightIcon aria-hidden className="h-[18px] w-[18px]" strokeWidth={1.5} />}
			</Link>
		</li>
	);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				aria-label="Open menu"
				className="-ml-2 inline-flex size-10 items-center justify-center rounded-sm transition-colors hover:bg-tonal lg:hidden"
			>
				<MenuIcon aria-hidden className="h-6 w-6" strokeWidth={1.5} />
			</SheetTrigger>
			<SheetContent
				side="left"
				showCloseButton={false}
				className="block overflow-y-auto border-none p-0 shadow-none data-[side=left]:w-full data-[side=left]:sm:max-w-full"
			>
				<div className="flex items-center justify-between border-b border-border p-4">
					<SheetTitle className="text-heading font-medium uppercase">Menu</SheetTitle>
					<SheetDescription className="sr-only">Site navigation</SheetDescription>
					<SheetClose
						aria-label="Close menu"
						className="inline-flex size-10 items-center justify-center rounded-sm transition-colors hover:bg-tonal"
					>
						<XIcon aria-hidden className="h-5 w-5" strokeWidth={1.5} />
					</SheetClose>
				</div>
				<nav aria-label="Menu" className="p-4">
					<ul className="flex flex-col gap-2">
						{row({ href: "/products", label: "All products" }, false)}
						{categories.map((link) => row(link))}
						{collections.map((link) => row(link))}
					</ul>
					<ul className="mt-6 flex flex-col gap-2 border-t border-border pt-6">
						{pages.map((link) => row(link, false))}
					</ul>
				</nav>
			</SheetContent>
		</Sheet>
	);
}
