"use client";

import Link from "next/link";
import { useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type NavLink = {
	href: string;
	label: string;
};

const linkClass =
	"font-body text-sm uppercase tracking-widest text-earth transition-colors duration-200 hover:text-crimson";

/**
 * The original's split header: spaced uppercase links on the left (Home, Products with a
 * category dropdown, Our Story), and below xl a menu button that opens the same
 * links, the search and the categories in a cream side panel.
 */
export function Navbar({
	links,
	categories,
	accountHref,
}: {
	links: NavLink[];
	categories: NavLink[];
	accountHref: string;
}) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<button
						type="button"
						aria-label="Open menu"
						className="-ml-2 inline-flex size-10 items-center justify-center text-earth transition-colors hover:text-crimson xl:hidden"
					>
						<svg
							aria-hidden="true"
							width="22"
							height="22"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
						>
							<line x1="3" y1="6" x2="21" y2="6" />
							<line x1="3" y1="12" x2="21" y2="12" />
							<line x1="3" y1="18" x2="21" y2="18" />
						</svg>
					</button>
				</SheetTrigger>
				<SheetContent
					side="left"
					className="block w-[86vw] overflow-y-auto border-earth/10 bg-background p-6"
				>
					<SheetTitle className="sr-only">Menu</SheetTitle>
					<div className="mt-8 border-b border-earth/10 pb-4">
						<MobileSearchInput onNavigate={() => setOpen(false)} />
					</div>
					<nav className="mt-2 flex flex-col">
						{links.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={() => setOpen(false)}
								className={`${linkClass} block py-3`}
							>
								{link.label}
							</Link>
						))}
						<a href={accountHref} className={`${linkClass} block py-3`}>
							Account
						</a>
					</nav>
					{categories.length > 0 && (
						<div className="mt-3 border-t border-earth/10 pt-4">
							<p className="font-body text-2xs uppercase tracking-widest text-earth-soft">Categories</p>
							<div className="mt-2 flex flex-col">
								{categories.map((category) => (
									<Link
										key={category.href}
										href={category.href}
										onClick={() => setOpen(false)}
										className="block py-2 font-body text-xs tracking-wider text-earth transition-colors hover:text-crimson"
									>
										{category.label}
									</Link>
								))}
							</div>
						</div>
					)}
				</SheetContent>
			</Sheet>

			<nav aria-label="Main" className="hidden items-center gap-8 xl:flex">
				{links.map((link) =>
					link.href === "/products" && categories.length > 0 ? (
						<div key={link.href} className="group relative">
							<Link
								href={link.href}
								className={`${linkClass} -mb-3 inline-flex items-center gap-1 py-2 pb-5`}
							>
								{link.label}
								<svg
									aria-hidden="true"
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<polyline points="6 9 12 15 18 9" />
								</svg>
							</Link>
							<div className="invisible absolute top-full left-0 w-56 -translate-y-2 opacity-0 transition-all duration-200 ease-luxury group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
								<div className="overflow-hidden rounded-lg border border-earth/10 bg-background shadow-luxury">
									<Link
										href="/products"
										className="block border-b border-earth/10 px-4 py-3 font-body text-xs uppercase tracking-widest text-earth transition-colors hover:bg-earth/5 hover:text-crimson"
									>
										All Products
									</Link>
									{categories.map((category) => (
										<Link
											key={category.href}
											href={category.href}
											className="block px-4 py-2.5 font-body text-xs tracking-wider text-earth transition-colors hover:bg-earth/5 hover:text-crimson"
										>
											{category.label}
										</Link>
									))}
								</div>
							</div>
						</div>
					) : (
						<Link key={link.href} href={link.href} className={linkClass}>
							{link.label}
						</Link>
					),
				)}
			</nav>
		</>
	);
}
