"use client";

import { MenuIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { StoreLogo } from "@/components/store-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type NavLink = {
	href: string;
	label: string;
};

/** The original's full-screen side menu: wordmark row, plain links, account at the foot. */
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
					className="-ml-2 inline-flex size-10 items-center justify-center rounded-md transition-colors hover:bg-accent"
				>
					<MenuIcon className="size-6" />
				</button>
			</SheetTrigger>
			<SheetContent side="left" className="w-screen gap-0 p-0 sm:w-1/2 sm:max-w-none">
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<SheetDescription className="sr-only">Store navigation</SheetDescription>
				<div className="flex h-full flex-col overflow-y-auto px-6 pt-6 pb-4">
					<div className="flex items-center justify-between gap-4 pr-10">
						<StoreLogo name={storeName} className="min-w-0" />
						<ThemeToggle />
					</div>
					<div className="mt-6">
						<MobileSearchInput onNavigate={close} />
					</div>
					<nav aria-label="Mobile" className="mt-4">
						<ul className="flex flex-col">
							{links.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										onClick={close}
										className="block py-2.5 text-lg text-foreground/80 transition-colors hover:text-foreground"
									>
										{link.label}
									</Link>
								</li>
							))}
							{!links.some((link) => link.href === "/products") && (
								<li>
									<Link
										href="/products"
										onClick={close}
										className="block py-2.5 text-lg text-foreground/80 transition-colors hover:text-foreground"
									>
										All products
									</Link>
								</li>
							)}
						</ul>
					</nav>
					<div className="mt-auto flex items-center justify-end pt-6">
						<a
							href={accountHref}
							className="inline-flex h-10 items-center gap-1.5 rounded-md px-4 text-base font-medium transition-colors hover:bg-accent"
						>
							<UserIcon className="size-4" />
							Log in
						</a>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
