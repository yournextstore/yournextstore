"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/app/cart/cart-context";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { useStoreConfig } from "@/components/store-config-provider";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type NavLink = {
	href: string;
	label: string;
};

const ROW =
	"flex w-full justify-center border-y border-taupe py-2 text-base transition-colors hover:bg-secondary";

/** The original's only navigation: a hamburger that slides a bordered white panel in from the left. */
export function Navbar({ links, storeName }: { links: NavLink[]; storeName: string }) {
	const [open, setOpen] = useState(false);
	const { openCart } = useCart();
	const { language } = useStoreConfig();
	const close = () => setOpen(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button
					type="button"
					aria-label="Open menu"
					className="-ml-2 flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-70"
				>
					<Menu className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
				</button>
			</SheetTrigger>
			<SheetContent
				side="left"
				hideClose
				className="block w-64 overflow-y-auto border-r border-black p-0 shadow-lg sm:max-w-64"
			>
				<div className="mr-1 mt-1 flex justify-end">
					<SheetClose className="flex h-10 w-10 items-center justify-center" aria-label="Close menu">
						<X className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
					</SheetClose>
				</div>
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<div className="mt-1 flex justify-center px-3">
					<Link
						href="/"
						onClick={close}
						className="text-center text-2xl font-light tracking-[1.08px] [overflow-wrap:anywhere]"
					>
						{storeName}
					</Link>
				</div>
				<div className="mt-6 px-3">
					<MobileSearchInput onNavigate={close} />
				</div>
				<nav aria-label="Main" className="mt-5 flex flex-col items-center gap-1 pb-8">
					{links.map((link) => (
						<Link key={link.href} href={link.href} onClick={close} className={ROW}>
							{link.label}
						</Link>
					))}
					{/* Plain <a>: /account is a proxied zone (AGENTS.md). */}
					<a href={language ? `/account?lang=${encodeURIComponent(language)}` : "/account"} className={ROW}>
						Account
					</a>
					<button
						type="button"
						className={ROW}
						onClick={() => {
							close();
							openCart();
						}}
					>
						Cart
					</button>
				</nav>
			</SheetContent>
		</Sheet>
	);
}
