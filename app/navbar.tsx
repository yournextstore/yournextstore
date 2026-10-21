"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type NavLink = {
	href: string;
	label: string;
};

export function Navbar({ links, accountHref }: { links: NavLink[]; accountHref: string }) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<nav aria-label="Main" className="hidden sp-lg:block">
				<ul className="flex items-center">
					{links.map((link) => (
						<li key={link.href}>
							<Link
								href={link.href}
								className="block whitespace-nowrap px-4 py-2.5 font-semibold uppercase transition-colors hover:text-tangerine-ink sp-xl:px-5"
							>
								{link.label}
							</Link>
						</li>
					))}
				</ul>
			</nav>

			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger
					aria-label="Open menu"
					className="order-last -mr-1 ml-3 p-1 transition-colors hover:text-tangerine-ink sp-lg:hidden"
				>
					<Menu className="size-[35px]" strokeWidth={1.5} aria-hidden="true" />
				</SheetTrigger>
				{/* The original drops a white panel down from the header rather than sliding a drawer. */}
				<SheetContent
					side="top"
					className="block max-h-svh gap-0 overflow-y-auto border-ink data-[side=top]:border-b-2 bg-background p-0 shadow-header [&>button:last-child]:hidden"
				>
					<div className="sp-container">
						<div className="flex items-center justify-between py-[22px]">
							<SheetTitle className="font-title text-[1.625rem] leading-none">Menu</SheetTitle>
							<SheetClose className="-mr-1 p-1 transition-colors hover:text-tangerine-ink">
								<X className="size-[35px]" strokeWidth={1.5} aria-hidden="true" />
								<span className="sr-only">Close menu</span>
							</SheetClose>
						</div>
						<MobileSearchInput onNavigate={() => setOpen(false)} />
						<nav aria-label="Mobile" className="pt-4 pb-2">
							<ul>
								{links.map((link) => (
									<li key={link.href}>
										<Link
											href={link.href}
											onClick={() => setOpen(false)}
											className="block py-2.5 font-semibold uppercase transition-colors hover:text-tangerine-ink"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</nav>
						<div className="pt-4 pb-8">
							<a href={accountHref} className="btn-brut btn-brut-sm">
								Account
							</a>
						</div>
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
}
