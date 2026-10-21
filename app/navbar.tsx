"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type NavLink = {
	href: string;
	label: string;
};

/** HiyoRi's side menu: a left sheet with large links and the brand block pinned at the bottom. */
export function Navbar({
	links,
	storeName,
	storeLine,
	socials,
}: {
	links: NavLink[];
	storeName: string;
	storeLine: string | null;
	socials: NavLink[];
}) {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				aria-label="Open menu"
				className="-ml-1.5 inline-flex h-9 w-9 items-center justify-center transition-opacity hover:opacity-70"
			>
				<Menu className="h-5 w-5" strokeWidth={1.75} />
			</SheetTrigger>
			<SheetContent
				side="left"
				className="block overflow-y-auto p-0 shadow-none data-[side=left]:w-full data-[side=left]:sm:max-w-xl"
				closeClassName="size-6 md:size-9"
			>
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<SheetDescription className="sr-only">Browse the shop</SheetDescription>
				<div className="flex min-h-full flex-col px-12 pt-20 pb-16 md:px-24 md:pt-28">
					<div className="md:hidden">
						<MobileSearchInput onNavigate={close} />
					</div>
					<nav aria-label="Main" className="mt-8 grid gap-y-3 md:mt-0">
						{links.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={close}
								className="w-fit text-xl transition-colors hover:text-muted-foreground md:text-3xl"
							>
								{link.label}
							</Link>
						))}
					</nav>
					<div className="mt-auto grid gap-y-3 pt-16">
						<Link href="/" onClick={close} className="w-fit text-xl font-medium uppercase md:text-4xl">
							{storeName}
						</Link>
						{storeLine && <p className="max-w-sm text-xs text-muted-foreground md:text-sm">{storeLine}</p>}
						{socials.length > 0 && (
							<ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
								{socials.map((social) => (
									<li key={social.href}>
										<a href={social.href} className="hover:text-foreground" target="_blank" rel="noreferrer">
											{social.label}
										</a>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
