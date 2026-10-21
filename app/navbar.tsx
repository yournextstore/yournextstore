"use client";

import { Menu, ShoppingBag, UserRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/app/cart/cart-context";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type NavLink = {
	href: string;
	label: string;
};

/**
 * Eyesome's phone menu: a hamburger that drops a small cream card under the bar. The original
 * listed Wishlist and Bag; here it carries the shop's sections, the account and the bag.
 */
export function Navbar({ links, accountHref }: { links: NavLink[]; accountHref: string }) {
	const [open, setOpen] = useState(false);
	const { openCart } = useCart();
	const item = "flex items-center gap-3 px-5 py-3 text-sm font-semibold transition-colors hover:bg-amber-100";

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				aria-label="Open menu"
				className="-mr-1 inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-black/5 md:hidden"
			>
				<Menu className="h-5 w-5" aria-hidden />
			</PopoverTrigger>
			<PopoverContent
				align="end"
				sideOffset={10}
				className="w-max min-w-52 gap-0 overflow-hidden rounded-lg border-0 bg-popover p-0 shadow ring-0"
			>
				<nav aria-label="Menu">
					<ul>
						{links.map((link) => (
							<li key={link.href}>
								<Link href={link.href} onClick={() => setOpen(false)} className={item}>
									{link.label}
								</Link>
							</li>
						))}
						<li className="border-t border-amber-200/70">
							{/* Plain <a>: /account is a proxied zone (see AGENTS.md). */}
							<a href={accountHref} className={item}>
								<UserRound className="h-4 w-4" aria-hidden /> Account
							</a>
						</li>
						<li>
							<button
								type="button"
								onClick={() => {
									setOpen(false);
									openCart();
								}}
								className={`${item} w-full`}
							>
								<ShoppingBag className="h-4 w-4" aria-hidden /> Bag
							</button>
						</li>
					</ul>
				</nav>
			</PopoverContent>
		</Popover>
	);
}
