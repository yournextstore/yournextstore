"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { NavCategory, NavCollection } from "@/lib/catalog";

export type NavLink = {
	href: string;
	label: string;
};

const rowClass =
	"flex items-center justify-between rounded-md px-2 py-2.5 text-[15px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground";

/** The original's "Select a category" drawer: the only navigation, behind the hamburger at every width. */
export function Navbar({
	categories,
	collections,
	pages,
}: {
	categories: NavCategory[];
	collections: NavCollection[];
	pages: NavLink[];
}) {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				aria-label="Open menu"
				className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-card/60 text-foreground transition-colors hover:bg-secondary"
			>
				<Menu className="size-4" />
			</SheetTrigger>
			<SheetContent
				side="left"
				className="gap-0 overflow-y-auto px-6 pt-5 pb-8 data-[side=left]:w-[85vw] data-[side=left]:sm:max-w-xs"
			>
				<SheetTitle className="pr-10 text-center font-display text-2xl font-bold">
					Select a category
				</SheetTitle>
				<SheetDescription className="sr-only">Browse the shop by category</SheetDescription>
				<nav aria-label="Shop" className="mt-6">
					<ul className="space-y-1">
						{categories.map((category) => (
							<li key={category.id}>
								<Link href={`/category/${category.slug}`} onClick={close} className={rowClass}>
									{category.name}
								</Link>
							</li>
						))}
						{collections.map((collection) => (
							<li key={collection.id}>
								<Link href={`/collection/${collection.slug}`} onClick={close} className={rowClass}>
									{collection.name}
								</Link>
							</li>
						))}
					</ul>
					<div className="my-6 border-t border-border" />
					<Link
						href="/products"
						onClick={close}
						className="flex h-10 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
					>
						View All Products
					</Link>
					{pages.length > 0 && (
						<ul className="mt-6 space-y-1">
							{pages.map((page) => (
								<li key={page.href}>
									<Link href={page.href} onClick={close} className={rowClass}>
										{page.label}
									</Link>
								</li>
							))}
						</ul>
					)}
				</nav>
			</SheetContent>
		</Sheet>
	);
}
