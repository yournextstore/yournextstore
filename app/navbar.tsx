"use client";

import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/app/cart/cart-context";
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

/** The phone menu: a cream drawer from the left with the brand, the categories, then account and cart. */
export function Navbar({
	links,
	categories,
	storeName,
	accountHref,
}: {
	links: NavLink[];
	categories: NavLink[];
	storeName: string;
	accountHref: string;
}) {
	const [open, setOpen] = useState(false);
	const { openCart, itemCount } = useCart();
	const close = () => setOpen(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				aria-label="Open menu"
				className="inline-grid size-11 place-items-center rounded-full lg:hidden"
			>
				<MenuIcon aria-hidden="true" className="size-6" strokeWidth={1.5} />
			</SheetTrigger>
			<SheetContent
				side="left"
				showCloseButton={false}
				className="block min-w-[270px] overflow-y-auto bg-background px-7 py-10 shadow-none data-[side=left]:w-[min(65vw,360px)] data-[side=left]:border-r-0 data-[side=left]:sm:max-w-none"
			>
				<SheetClose className="absolute top-8 right-4 inline-grid size-11 place-items-center rounded-full">
					<XIcon aria-hidden="true" className="size-6" strokeWidth={1.5} />
					<span className="sr-only">Close menu</span>
				</SheetClose>
				<SheetTitle className="mt-12 mb-10 text-label-md font-semibold uppercase">{storeName}</SheetTitle>
				<SheetDescription className="sr-only">Browse the shop and store pages.</SheetDescription>
				<nav aria-label="Mobile" className="flex flex-col gap-6 text-body-md">
					{links.map((link) => (
						<Link key={link.href} href={link.href} onClick={close}>
							{link.label}
						</Link>
					))}
				</nav>
				{categories.length > 0 && (
					<nav
						aria-label="Shop categories"
						className="mt-7 flex flex-col gap-4 border-t border-border pt-7 text-body-sm text-muted-foreground"
					>
						{categories.map((link) => (
							<Link key={link.href} href={link.href} onClick={close} className="hover:text-foreground">
								{link.label}
							</Link>
						))}
					</nav>
				)}
				<div className="mt-7 flex flex-col items-start gap-6 border-t border-border pt-7 text-body-md">
					<a href={accountHref}>Account</a>
					<button
						type="button"
						onClick={() => {
							close();
							openCart();
						}}
					>
						Cart{itemCount > 0 ? ` · ${itemCount} ${itemCount === 1 ? "item" : "items"}` : ""}
					</button>
				</div>
			</SheetContent>
		</Sheet>
	);
}
