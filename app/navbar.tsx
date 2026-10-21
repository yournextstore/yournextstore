"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type NavLink = {
	href: string;
	label: string;
	/** Store-wide links (shop, journal, about) show in the desktop bar; the rest live in the menu. */
	primary?: boolean;
};

export function DesktopNav({ links }: { links: NavLink[] }) {
	return (
		<nav aria-label="Main" className="mr-2 hidden items-center gap-6 lg:flex">
			{links
				.filter((link) => link.primary)
				.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						className="whitespace-nowrap text-body font-medium underline-offset-4 hover:underline"
					>
						{link.label}
					</Link>
				))}
		</nav>
	);
}

export function MobileMenu({ links, storeName }: { links: NavLink[]; storeName: string }) {
	const [open, setOpen] = useState(false);
	const primary = links.filter((link) => link.primary);
	const secondary = links.filter((link) => !link.primary);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				aria-label="Open menu"
				className="inline-flex size-10 items-center justify-center rounded-md transition-colors hover:bg-current/10 lg:hidden"
			>
				<MenuIcon className="h-5 w-5" strokeWidth={1.75} />
			</SheetTrigger>
			<SheetContent
				side="right"
				className="block overflow-y-auto p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-sm"
			>
				<div className="flex h-[60px] items-center border-b border-border px-4">
					<SheetTitle className="truncate pr-10 text-[1.375rem] font-light tracking-[-0.02em]">
						{storeName}
					</SheetTitle>
					<SheetDescription className="sr-only">Site navigation and search</SheetDescription>
				</div>
				<div className="px-4 pt-6">
					<MobileSearchInput onNavigate={() => setOpen(false)} />
				</div>
				<nav aria-label="Menu" className="px-4 pb-10 pt-6">
					<ul className="space-y-1">
						{primary.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									onClick={() => setOpen(false)}
									className="block py-1 text-heading font-semibold tracking-[-0.03em] hover:text-primary"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
					{secondary.length > 0 && (
						<>
							<p className="mt-8 text-caption font-semibold uppercase tracking-label text-muted-foreground">
								Browse
							</p>
							<ul className="mt-3">
								{secondary.map((link) => (
									<li key={link.href}>
										<Link
											href={link.href}
											onClick={() => setOpen(false)}
											className="block py-2 text-body hover:text-primary"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</>
					)}
				</nav>
			</SheetContent>
		</Sheet>
	);
}
