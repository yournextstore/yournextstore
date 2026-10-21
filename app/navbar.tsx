"use client";

import { House, Info, Menu, Search, ShoppingBag, Store, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type NavLink = {
	href: string;
	label: string;
};

const NAV_LINK =
	"rounded-md font-serif text-heading-xl font-normal text-foreground transition-colors hover:text-brand-hover focus-visible:text-brand-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-hover";

/** Desktop links in the header: Merriweather at 20px, no underline, burgundy on hover. */
export function DesktopNav({ links }: { links: NavLink[] }) {
	return (
		<nav aria-label="Main" className="hidden items-center gap-10 lg:flex xl:gap-12">
			{links.map((link) => (
				<Link key={link.href} href={link.href} className={NAV_LINK}>
					{link.label}
				</Link>
			))}
		</nav>
	);
}

/**
 * The original's mobile menu: a 18rem burgundy panel from the right over a blurred page, the
 * wordmark on top, icon rows divided by darker rules, the first row inked deeper.
 */
export function MobileMenu({
	links,
	categories,
	storeName,
	accountHref,
}: {
	links: NavLink[];
	categories: NavLink[];
	storeName: string;
	accountHref: string;
}) {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);
	const icons = [House, ShoppingBag, Store, Info];

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				aria-label="Open menu"
				className="relative z-10 -mr-2 rounded-md p-2 text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-hover lg:hidden"
			>
				<Menu aria-hidden="true" className="h-6 w-6" />
			</SheetTrigger>
			<SheetContent
				side="right"
				showCloseButton={false}
				overlayClassName="bg-background/20 backdrop-blur-md"
				className="block max-w-[calc(100vw-4rem)] gap-0 overflow-visible border-none bg-menu p-0 text-on-fill shadow-none data-[side=right]:w-72 data-[side=right]:sm:max-w-72"
			>
				<button
					type="button"
					onClick={close}
					aria-label="Close menu"
					className="absolute top-7 -left-14 rounded-md p-2 text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-hover"
				>
					<X aria-hidden="true" className="h-6 w-6" />
				</button>
				<div className="flex h-full flex-col justify-between overflow-y-auto">
					<div className="flex justify-center px-6 py-8">
						<SheetTitle
							render={<Link href="/" onClick={close} />}
							className="font-brand text-heading-2xl font-normal text-on-fill"
						>
							{storeName}.
						</SheetTitle>
						<SheetDescription className="sr-only">Site navigation</SheetDescription>
					</div>
					<nav aria-label="Mobile">
						{links.map((link, index) => {
							const Icon = icons[index] ?? Info;
							return (
								<div key={link.href}>
									<Link
										href={link.href}
										onClick={close}
										className="flex items-center gap-6 border-b border-brand p-6 font-serif text-heading-xl text-on-fill data-[first=true]:border-t data-[first=true]:bg-brand"
										data-first={index === 0}
									>
										<Icon aria-hidden="true" className="h-6 w-6 text-background" />
										{link.label}
									</Link>
									{link.href === "/products" && categories.length > 0 ? (
										<ul className="border-b border-brand py-2">
											{categories.map((category) => (
												<li key={category.href}>
													<Link
														href={category.href}
														onClick={close}
														className="block py-2 pr-6 pl-[4.5rem] font-sans text-body-md text-on-fill/90 hover:text-on-fill hover:underline"
													>
														{category.label}
													</Link>
												</li>
											))}
										</ul>
									) : null}
								</div>
							);
						})}
						<Link
							href="/search"
							onClick={close}
							className="flex items-center gap-6 border-b border-brand p-6 font-serif text-heading-xl text-on-fill"
						>
							<Search aria-hidden="true" className="h-6 w-6 text-background" />
							Search
						</Link>
					</nav>
					<div className="flex justify-center px-6 py-8">
						{/* Plain <a>: /account is a proxied zone. */}
						<a href={accountHref} className="inline-flex items-center gap-2 font-sans text-on-fill underline">
							<UserRound aria-hidden="true" className="h-4 w-4" />
							Your account
						</a>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
