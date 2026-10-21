"use client";

import { ChevronDownIcon, ChevronRightIcon, MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type NavLink = {
	href: string;
	label: string;
	children?: { href: string; label: string }[];
};

/**
 * Pilot's centred desktop menu: uppercase labels, a chevron on the ones with a dropdown. The
 * panel opens on hover and on keyboard focus (focus-within), so tabbing walks into it.
 */
export function DesktopNav({ links }: { links: NavLink[] }) {
	return (
		<nav aria-label="Main" className="hidden h-full items-center justify-center lg:flex">
			<ul className="flex h-full items-center gap-6 xl:gap-8">
				{links.map((link) => (
					<li key={link.href} className="group/nav relative flex h-full items-center">
						<Link
							href={link.href}
							className="inline-flex items-center gap-1 py-2 text-body-sm uppercase tracking-wide whitespace-nowrap hover:underline"
						>
							{link.label}
							{link.children?.length ? (
								<ChevronDownIcon
									aria-hidden
									className="size-3.5 transition-transform group-focus-within/nav:rotate-180 group-hover/nav:rotate-180"
								/>
							) : null}
						</Link>
						{link.children?.length ? (
							<div className="invisible absolute top-full left-1/2 z-50 min-w-56 -translate-x-1/2 pt-0 opacity-0 transition-opacity duration-200 group-focus-within/nav:visible group-focus-within/nav:opacity-100 group-hover/nav:visible group-hover/nav:opacity-100">
								<ul className="rounded-b-md border border-t-0 border-border bg-background p-5 text-foreground shadow-header">
									{link.children.map((child) => (
										<li key={child.href}>
											<Link
												href={child.href}
												className="block py-1.5 text-body-sm whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground hover:underline"
											>
												{child.label}
											</Link>
										</li>
									))}
								</ul>
							</div>
						) : null}
					</li>
				))}
			</ul>
		</nav>
	);
}

/** Full-height left drawer: "Menu" title bar, one row per item, children fold out under a chevron. */
export function MobileMenu({ links }: { links: NavLink[] }) {
	const [open, setOpen] = useState(false);
	const [expanded, setExpanded] = useState<string | null>(null);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button
					type="button"
					aria-label="Open menu"
					className="inline-flex size-9 items-center justify-center lg:hidden"
				>
					<MenuIcon aria-hidden className="size-5" strokeWidth={1.5} />
				</button>
			</SheetTrigger>
			<SheetContent
				side="left"
				className="w-full gap-0 overflow-y-auto border-r-0 p-0 sm:max-w-sm [&>button:last-child]:hidden"
			>
				<div className="flex h-14 items-center justify-between border-b border-border px-4">
					<SheetTitle className="font-sans text-body font-normal">Menu</SheetTitle>
					<SheetClose className="inline-flex size-9 items-center justify-center" aria-label="Close menu">
						<XIcon aria-hidden className="size-5" strokeWidth={1.5} />
					</SheetClose>
				</div>
				<div className="px-4 pt-4">
					<MobileSearchInput onNavigate={() => setOpen(false)} />
				</div>
				<nav aria-label="Main" className="px-4 py-2">
					<ul>
						{links.map((link) => {
							const isOpen = expanded === link.href;
							return (
								<li key={link.href}>
									{link.children?.length ? (
										<>
											<button
												type="button"
												aria-expanded={isOpen}
												onClick={() => setExpanded(isOpen ? null : link.href)}
												className="flex w-full items-center justify-between py-3.5 text-left text-body"
											>
												{link.label}
												<ChevronRightIcon
													aria-hidden
													className={cn("size-4 transition-transform", isOpen && "rotate-90")}
													strokeWidth={1.5}
												/>
											</button>
											{isOpen ? (
												<ul className="mb-2 border-l border-border pl-4">
													<li>
														<Link
															href={link.href}
															onClick={() => setOpen(false)}
															className="block py-2.5 text-body-sm"
														>
															View all
														</Link>
													</li>
													{link.children.map((child) => (
														<li key={child.href}>
															<Link
																href={child.href}
																onClick={() => setOpen(false)}
																className="block py-2.5 text-body-sm text-muted-foreground"
															>
																{child.label}
															</Link>
														</li>
													))}
												</ul>
											) : null}
										</>
									) : (
										<Link
											href={link.href}
											onClick={() => setOpen(false)}
											className="flex items-center justify-between py-3.5 text-body"
										>
											{link.label}
											<ChevronRightIcon aria-hidden className="size-4" strokeWidth={1.5} />
										</Link>
									)}
								</li>
							);
						})}
					</ul>
				</nav>
			</SheetContent>
		</Sheet>
	);
}
