"use client";

import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export type NavLink = {
	href: string;
	label: string;
};

const MAIN_LINKS: NavLink[] = [
	{ href: "/products", label: "Shop" },
	{ href: "/about", label: "About" },
];

/** Left side of the header: "Shop · About" on desktop, the original's drop-down list on phones. */
export function Navbar({ categories }: { categories: NavLink[] }) {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (!open) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open]);

	return (
		<div className="flex shrink-0 items-center md:flex-1 md:basis-0">
			<button
				type="button"
				aria-label={open ? "Close menu" : "Open menu"}
				aria-expanded={open}
				aria-controls="mobile-menu"
				onClick={() => setOpen((value) => !value)}
				className="-ml-1 p-1 text-foreground md:hidden"
			>
				{open ? <X aria-hidden className="h-6 w-6" /> : <Menu aria-hidden className="h-6 w-6" />}
			</button>

			<nav aria-label="Main" className="hidden md:block">
				<ul className="flex items-center text-gray-700">
					{MAIN_LINKS.map((link) => (
						<li key={link.href}>
							<Link href={link.href} className="inline-block px-4 py-2 hover:text-black hover:underline">
								{link.label}
							</Link>
						</li>
					))}
					<li>
						<Link href="/search" aria-label="Search" className="inline-flex px-4 py-2 hover:text-black">
							<Search aria-hidden className="h-5 w-5" strokeWidth={1.75} />
						</Link>
					</li>
				</ul>
			</nav>

			{open && (
				<nav
					id="mobile-menu"
					aria-label="Mobile"
					className="absolute inset-x-0 top-full z-40 border-b border-border bg-background px-6 pb-6 md:hidden"
				>
					<ul className="text-base text-gray-700">
						{[...MAIN_LINKS, { href: "/search", label: "Search" }].map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									onClick={() => setOpen(false)}
									className="block py-2 hover:text-black hover:underline"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
					{categories.length > 0 && (
						<>
							<p className="mt-4 text-sm font-bold tracking-wide text-foreground uppercase">Categories</p>
							<ul className="mt-1 grid grid-cols-2 gap-x-4 text-sm text-gray-700">
								{categories.map((link) => (
									<li key={link.href}>
										<Link
											href={link.href}
											onClick={() => setOpen(false)}
											className="block py-2 hover:text-black hover:underline"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</>
					)}
				</nav>
			)}
		</div>
	);
}
