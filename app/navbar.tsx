"use client";

import { ChevronRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type NavLink = {
	href: string;
	label: string;
};

export type NavMenu = {
	/** Columns of the "Shop" mega menu: Penny's subsections. */
	columns: { title: string; links: NavLink[] }[];
	/** Every category, for the phone menu (the desktop panel splits them over columns). */
	categories: NavLink[];
	/** Plain top-level links beside the menu (top categories, About). */
	links: NavLink[];
	accountHref: string;
};

/** Desktop links with the Shop mega menu (Penny's Popover panel: full width under the bar). */
export function DesktopNav({ menu }: { menu: NavMenu }) {
	const [open, setOpen] = useState(false);
	const panelRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!open) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setOpen(false);
				buttonRef.current?.focus();
			}
		};
		const onPointer = (event: PointerEvent) => {
			const target = event.target as Node;
			if (!panelRef.current?.contains(target) && !buttonRef.current?.contains(target)) setOpen(false);
		};
		document.addEventListener("keydown", onKey);
		document.addEventListener("pointerdown", onPointer);
		return () => {
			document.removeEventListener("keydown", onKey);
			document.removeEventListener("pointerdown", onPointer);
		};
	}, [open]);

	return (
		<div className="hidden h-full lg:ml-8 lg:flex">
			<div className="flex h-full justify-center space-x-8">
				<div className="flex">
					<button
						ref={buttonRef}
						type="button"
						aria-expanded={open}
						aria-controls="shop-menu"
						onClick={() => setOpen((value) => !value)}
						className={cn(
							"relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out outline-none focus-visible:text-brand",
							open ? "border-brand text-brand" : "border-transparent text-gray-700 hover:text-gray-800",
						)}
					>
						Shop
					</button>
				</div>
				{menu.links.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						className="flex items-center whitespace-nowrap text-sm font-medium text-gray-700 hover:text-gray-800"
					>
						{link.label}
					</Link>
				))}
			</div>

			<div
				ref={panelRef}
				id="shop-menu"
				hidden={!open}
				className="absolute inset-x-0 top-full z-30 text-sm text-gray-500"
			>
				{/* Penny draws the shadow on a shorter element so it does not poke out above the panel. */}
				<div className="absolute inset-0 top-1/2 bg-white shadow" aria-hidden="true" />
				<div className="relative bg-white">
					<div className="mx-auto max-w-7xl px-8 pt-10">
						<Link
							href="/products"
							onClick={() => setOpen(false)}
							className="text-gray-700 hover:text-gray-800"
						>
							Shop all products
						</Link>
						<div className="grid grid-cols-4 items-start gap-x-8 gap-y-10 pt-10 pb-12">
							{menu.columns.map((column) => (
								<div key={column.title}>
									<p className="font-medium text-gray-900">{column.title}</p>
									<ul className="mt-4 space-y-4">
										{column.links.map((link) => (
											<li key={link.href} className="flex">
												<Link
													href={link.href}
													onClick={() => setOpen(false)}
													className="text-gray-700 hover:text-gray-800"
												>
													{link.label}
												</Link>
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

/** Penny's mobile menu: a left slide-over with disclosure sections, then the account links. */
export function MobileNav({ menu }: { menu: NavMenu }) {
	const [open, setOpen] = useState(false);
	const [expanded, setExpanded] = useState<string | null>(null);
	const close = () => setOpen(false);
	const sections = [
		...(menu.categories.length > 0 ? [{ title: "Categories", links: menu.categories }] : []),
		...menu.columns.filter((column) => !column.title.endsWith("ategories")),
	];

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button
					type="button"
					aria-label="Open menu"
					className="-ml-2 rounded-md bg-white p-2 text-gray-500 hover:text-gray-600"
				>
					<Menu className="h-6 w-6" aria-hidden="true" />
				</button>
			</SheetTrigger>
			<SheetContent
				side="left"
				hideClose
				className="block w-full max-w-xs gap-0 overflow-y-auto border-r-0 bg-white pb-12 shadow-xl sm:max-w-xs"
			>
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<SheetDescription className="sr-only">Browse the shop</SheetDescription>
				<div className="flex px-4 pt-5 pb-2">
					<SheetClose asChild>
						<button
							type="button"
							className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-gray-600"
						>
							<span className="sr-only">Close menu</span>
							<X className="h-6 w-6" aria-hidden="true" />
						</button>
					</SheetClose>
				</div>

				<div className="px-4 pt-4">
					<MobileSearchInput onNavigate={close} />
				</div>

				<nav aria-label="Sidebar" className="my-5 space-y-1 px-4">
					<Link
						href="/products"
						onClick={close}
						className="flex w-full items-center rounded-md py-2 pr-2 pl-7 text-sm font-medium text-gray-800 hover:bg-gray-50"
					>
						Shop all
					</Link>
					{sections.map((column) => {
						const isOpen = expanded === column.title;
						return (
							<div key={column.title} className="space-y-1">
								<button
									type="button"
									aria-expanded={isOpen}
									onClick={() => setExpanded(isOpen ? null : column.title)}
									className="group flex w-full items-center rounded-md py-2 pr-2 text-left text-sm font-medium text-gray-800 hover:bg-gray-50"
								>
									<ChevronRight
										aria-hidden="true"
										className={cn(
											"mr-2 h-5 w-5 shrink-0 fill-current transition-transform duration-150",
											isOpen ? "rotate-90 text-gray-500" : "text-gray-400",
										)}
									/>
									{column.title}
								</button>
								{isOpen && (
									<div className="space-y-1">
										{column.links.map((link) => (
											<Link
												key={link.href}
												href={link.href}
												onClick={close}
												className="flex w-full items-center rounded-md py-2 pr-2 pl-10 text-sm font-medium text-gray-800 hover:bg-gray-50"
											>
												{link.label}
											</Link>
										))}
									</div>
								)}
							</div>
						);
					})}
					{menu.links
						.filter((link) => !link.href.startsWith("/category/"))
						.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={close}
								className="flex w-full items-center rounded-md py-2 pr-2 pl-7 text-sm font-medium text-gray-800 hover:bg-gray-50"
							>
								{link.label}
							</Link>
						))}
				</nav>

				<div className="border-t border-gray-200" />
				{/* Plain <a>: /account is a proxied zone, a soft navigation would 500. */}
				<div className="space-y-6 px-4 py-6">
					<a href={menu.accountHref} className="-m-2 block p-2 font-medium text-gray-900">
						Create an account
					</a>
					<a href={menu.accountHref} className="-m-2 block p-2 font-medium text-gray-900">
						Sign in
					</a>
				</div>
			</SheetContent>
		</Sheet>
	);
}
