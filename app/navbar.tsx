"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type NavLink = {
	href: string;
	label: string;
};

export function Navbar({ links }: { links: NavLink[] }) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<div className="flex items-center lg:hidden">
				<Sheet open={open} onOpenChange={setOpen}>
					<SheetTrigger
						aria-label="Open menu"
						className="-ml-2 inline-flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:text-pine"
					>
						<Menu className="size-6" strokeWidth={1.75} />
					</SheetTrigger>
					<SheetContent side="left" className="block gap-0 overflow-y-auto bg-surface p-6">
						<SheetTitle className="font-heading text-2xl font-semibold">Menu</SheetTitle>
						<div className="mt-6">
							<MobileSearchInput onNavigate={() => setOpen(false)} />
						</div>
						<nav aria-label="Mobile navigation" className="mt-4 flex flex-col divide-y divide-line">
							{links.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									onClick={() => setOpen(false)}
									className="py-3 font-heading text-lg text-ink transition-colors hover:text-pine"
								>
									{link.label}
								</Link>
							))}
							<Link
								href="/about"
								onClick={() => setOpen(false)}
								className="py-3 font-heading text-lg text-ink transition-colors hover:text-pine"
							>
								Our story
							</Link>
						</nav>
					</SheetContent>
				</Sheet>
			</div>
			<span className="hidden lg:block" aria-hidden="true" />
			<nav aria-label="Main navigation" className="hidden items-center justify-center gap-8 text-ink lg:flex">
				{links.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						className="whitespace-nowrap font-heading text-[15px] transition-colors hover:text-pine"
					>
						{link.label}
					</Link>
				))}
			</nav>
		</>
	);
}
