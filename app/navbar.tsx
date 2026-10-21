"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { Suspense, useState } from "react";
import { HeaderSearch, HeaderSearchSkeleton } from "@/components/bento/header-search";
import { squareButton } from "@/components/bento/styles";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type NavLink = {
	href: string;
	label: string;
};

/** Full-screen menu sliding in from the left, as in the reference. */
export function MobileMenu({ links }: { links: NavLink[] }) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button type="button" aria-label="Open mobile menu" className={squareButton}>
					<Menu className="h-4 w-4" aria-hidden="true" />
				</button>
			</SheetTrigger>
			<SheetContent
				side="left"
				hideClose
				overlayClassName="bg-black/30 backdrop-blur-[.5px]"
				className="w-full gap-0 overflow-y-auto border-none bg-white p-4 pb-6 shadow-none sm:max-w-none dark:bg-black"
			>
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<SheetClose asChild>
					<button type="button" aria-label="Close mobile menu" className={`${squareButton} mb-4`}>
						<X className="h-6 w-6" aria-hidden="true" />
					</button>
				</SheetClose>
				<div className="mb-4 w-full">
					<Suspense fallback={<HeaderSearchSkeleton />}>
						<HeaderSearch onNavigate={() => setOpen(false)} />
					</Suspense>
				</div>
				<ul className="flex w-full flex-col">
					{links.map((link) => (
						<li
							key={link.href}
							className="py-2 text-xl text-black transition-colors hover:text-neutral-500 dark:text-white"
						>
							<Link href={link.href} onClick={() => setOpen(false)} className="block">
								{link.label}
							</Link>
						</li>
					))}
				</ul>
			</SheetContent>
		</Sheet>
	);
}
