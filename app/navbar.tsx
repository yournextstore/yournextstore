"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { Suspense, useState } from "react";
import { HeaderSearch, HeaderSearchSkeleton } from "@/components/bento/header-search";
import { LogoMark } from "@/components/bento/logo-mark";
import { squareButton } from "@/components/bento/styles";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type NavLink = {
	href: string;
	label: string;
};

/** Full-screen deep-water menu sliding in from the left: wordmark, search, divided list. */
export function MobileMenu({ links, storeName }: { links: NavLink[]; storeName: string }) {
	const [open, setOpen] = useState(false);
	const items = [{ href: "/products", label: "All products" }, ...links];

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger aria-label="Open menu" className={squareButton}>
				<Menu className="h-5 w-5" aria-hidden="true" />
			</SheetTrigger>
			<SheetContent
				side="left"
				showCloseButton={false}
				overlayClassName="bg-black/50 backdrop-blur-[.5px]"
				className="block overflow-y-auto border-none bg-deep p-4 pb-6 text-bone shadow-none data-[side=left]:w-full data-[side=left]:sm:max-w-none"
			>
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<div className="mb-5 flex items-center justify-between gap-4">
					<Link href="/" onClick={() => setOpen(false)} className="min-w-0">
						<LogoMark name={storeName} />
					</Link>
					<SheetClose aria-label="Close menu" className={squareButton}>
						<X className="h-6 w-6" aria-hidden="true" />
					</SheetClose>
				</div>
				<div className="mb-6 w-full">
					<Suspense fallback={<HeaderSearchSkeleton />}>
						<HeaderSearch onNavigate={() => setOpen(false)} />
					</Suspense>
				</div>
				<ul className="flex w-full flex-col divide-y divide-white/10">
					{items.map((link) => (
						<li key={link.href}>
							<Link
								href={link.href}
								onClick={() => setOpen(false)}
								className="block py-3 text-lg font-medium text-[#e5e5e5] transition-colors hover:text-amber"
							>
								{link.label}
							</Link>
						</li>
					))}
				</ul>
			</SheetContent>
		</Sheet>
	);
}
