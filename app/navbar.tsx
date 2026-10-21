"use client";

import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/grilli/logo";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
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

/** Centered uppercase links with the gold double rule under the current one (xl and up, as the original). */
export function DesktopNav({ links }: { links: NavLink[] }) {
	return (
		<nav aria-label="Main" className="hidden xl:block">
			<ul className="flex items-center gap-[30px]">
				{links.map((link) => (
					<li key={link.href}>
						<Link
							href={link.href}
							data-nav-link={link.href}
							className="hover-underline block py-2.5 text-label-2 font-bold uppercase tracking-1 text-white transition-colors hover:text-gold aria-[current=page]:text-gold"
						>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}

/**
 * Marks the current nav link through the DOM. It reads the pathname, so it sits in its own
 * Suspense boundary and the nav itself stays in the prerendered shell.
 */
export function NavActive() {
	const pathname = usePathname();
	useEffect(() => {
		const links = document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]");
		for (const link of links) {
			const href = link.dataset.navLink ?? "";
			const current = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
			if (current) link.setAttribute("aria-current", "page");
			else link.removeAttribute("aria-current");
		}
	}, [pathname]);
	return null;
}

/** The original's slide-in sidebar: logo, ruled link list with a gold diamond, then the visit block. */
export function MobileMenu({
	links,
	storeName,
	description,
	freeShipping,
	accountHref,
}: {
	links: NavLink[];
	storeName: string;
	description: string | null;
	freeShipping: string | null;
	accountHref: string;
}) {
	const [open, setOpen] = useState(false);
	// Read when the menu opens rather than through usePathname(), which would stream the
	// hamburger out of the prerendered shell.
	const [pathname, setPathname] = useState("");

	return (
		<Sheet
			open={open}
			onOpenChange={(next) => {
				if (next) setPathname(window.location.pathname);
				setOpen(next);
			}}
		>
			<SheetTrigger
				aria-label="Open menu"
				className="group -mr-3 flex size-12 cursor-pointer flex-col items-end justify-center gap-2 p-3 xl:hidden"
			>
				<span className="h-0.5 w-[30px] origin-left bg-white motion-safe:animate-[grilli-menu_400ms_ease-in-out_alternate_infinite]" />
				<span className="h-0.5 w-[30px] origin-left bg-white motion-safe:animate-[grilli-menu_400ms_ease-in-out_150ms_alternate_infinite]" />
				<span className="h-0.5 w-[30px] origin-left bg-white motion-safe:animate-[grilli-menu_400ms_ease-in-out_300ms_alternate_infinite]" />
				<MenuIcon className="sr-only" aria-hidden="true" />
			</SheetTrigger>
			<SheetContent
				side="left"
				showCloseButton={false}
				className="block overflow-y-auto bg-smoky px-[30px] pb-[50px] data-[side=left]:w-full data-[side=left]:max-w-[360px] data-[side=left]:border-r-0 data-[side=left]:sm:max-w-[360px]"
			>
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<SheetDescription className="sr-only">Site navigation and search</SheetDescription>
				<SheetClose
					aria-label="Close menu"
					className="mt-[30px] mb-5 ml-auto flex size-9 cursor-pointer items-center justify-center rounded-full border border-current text-white transition-colors hover:text-gold"
				>
					<XIcon className="size-5" aria-hidden="true" />
				</SheetClose>
				<Link href="/" onClick={() => setOpen(false)} className="mx-auto mb-10 block w-max">
					<Logo name={storeName} />
				</Link>
				<MobileSearchInput onNavigate={() => setOpen(false)} />
				<ul className="mt-8 mb-16 border-b border-line">
					{links.map((link) => {
						const current =
							link.href === "/"
								? pathname === "/"
								: pathname === link.href || pathname.startsWith(`${link.href}/`);
						return (
							<li key={link.href} className="border-t border-line">
								<Link
									href={link.href}
									onClick={() => setOpen(false)}
									aria-current={current ? "page" : undefined}
									className="group/link relative flex items-center py-3 text-label-1 uppercase text-white"
								>
									<span className="diamond absolute left-0 opacity-0 transition-opacity group-hover/link:opacity-100 group-aria-[current=page]/link:opacity-100" />
									<span className="transition-transform duration-250 group-hover/link:translate-x-5 group-hover/link:text-gold group-aria-[current=page]/link:translate-x-5 group-aria-[current=page]/link:text-gold">
										{link.label}
									</span>
								</Link>
							</li>
						);
					})}
				</ul>
				<div className="text-center">
					<p className="mb-4 font-display text-headline-1 text-white">Order Online</p>
					{description && <p className="text-body-4 text-silver">{description}</p>}
					{freeShipping && (
						<p className="mt-2.5 text-body-4 text-silver">Free delivery over {freeShipping}</p>
					)}
					<span className="diamond mx-auto my-[30px]" />
					<p className="mb-2.5 font-bold">Your account</p>
					{/* Plain <a>: /account is a proxied zone (AGENTS.md). */}
					<a href={accountHref} className="hover-underline mx-auto block text-body-1 text-gold">
						Orders &amp; sign in
					</a>
				</div>
			</SheetContent>
		</Sheet>
	);
}
