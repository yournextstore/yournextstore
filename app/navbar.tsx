"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { NavData, NavItem } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const MAX_DROPDOWN = 10;

function Dropdown({ label, items, viewAll }: { label: string; items: NavItem[]; viewAll?: NavItem }) {
	const [open, setOpen] = useState(false);
	if (items.length === 0) return null;
	const close = () => {
		setOpen(false);
		if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
	};
	return (
		<li className="group relative">
			<button
				type="button"
				aria-expanded={open}
				onClick={() => setOpen((v) => !v)}
				className="flex cursor-pointer items-center gap-2.5 py-1 uppercase transition-colors hover:text-tangerine"
			>
				{label}
				<ChevronDown
					aria-hidden
					className="size-5 transition-transform group-hover:rotate-180"
					strokeWidth={2}
				/>
			</button>
			<ul
				className={cn(
					"invisible absolute left-0 top-full z-30 mt-3 flex min-w-60 flex-col gap-1 rounded-b-2xl bg-background p-6 text-base font-bold normal-case leading-8 opacity-0 shadow-lg transition-opacity group-hover:visible group-hover:opacity-100",
					open && "visible opacity-100",
				)}
			>
				{items.slice(0, MAX_DROPDOWN).map((item) => (
					<li key={item.href}>
						<Link href={item.href} onClick={close} className="block transition-colors hover:text-tangerine">
							{item.label}
						</Link>
					</li>
				))}
				{viewAll && (
					<li className="mt-2 border-t border-border pt-2">
						<Link
							href={viewAll.href}
							onClick={close}
							className="block text-tangerine hover:text-tangerine-deep"
						>
							{viewAll.label}
						</Link>
					</li>
				)}
			</ul>
		</li>
	);
}

/** The original's second header row: uppercase links spread across the column, "Category" opens a panel. */
export function DesktopNav({ nav }: { nav: NavData }) {
	return (
		<nav aria-label="Main" className="hidden md:block">
			<ul className="frame flex items-center justify-between gap-5 py-5 text-sm font-bold text-ink lg:text-lg">
				<Dropdown
					label="Category"
					items={nav.categories}
					viewAll={{ href: "/products", label: "All products" }}
				/>
				<Dropdown label="Collections" items={nav.collections} />
				<li>
					<Link
						href="/products"
						className="whitespace-nowrap uppercase transition-colors hover:text-tangerine"
					>
						New arrivals
					</Link>
				</li>
				<li>
					<Link
						href="/products?sort=price-asc"
						className="whitespace-nowrap uppercase transition-colors hover:text-tangerine"
					>
						Shop by price
					</Link>
				</li>
				{nav.blog && (
					<li>
						<Link href="/blog" className="uppercase transition-colors hover:text-tangerine">
							Blog
						</Link>
					</li>
				)}
				<li>
					<Link href="/about" className="whitespace-nowrap uppercase transition-colors hover:text-tangerine">
						About us
					</Link>
				</li>
			</ul>
		</nav>
	);
}

function MenuSection({
	title,
	items,
	onNavigate,
}: {
	title: string;
	items: NavItem[];
	onNavigate: () => void;
}) {
	if (items.length === 0) return null;
	return (
		<div className="border-t border-border pt-5">
			<h2 className="font-display text-xl font-bold text-ink">{title}</h2>
			<ul className="mt-2 flex flex-col">
				{items.map((item) => (
					<li key={item.href}>
						<Link
							href={item.href}
							onClick={onNavigate}
							className="block py-1.5 text-base text-ink transition-colors hover:text-tangerine"
						>
							{item.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

/** Phone header: three-line "hamburger" opening the menu sheet. */
export function MobileMenu({ nav }: { nav: NavData }) {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				aria-label="Open menu"
				className="flex size-11 cursor-pointer flex-col items-center justify-center gap-[5px] md:hidden"
			>
				<span className="h-0.5 w-8 rounded bg-ink" />
				<span className="h-0.5 w-8 rounded bg-ink" />
				<span className="h-0.5 w-8 rounded bg-ink" />
			</SheetTrigger>
			<SheetContent
				side="right"
				className="block overflow-y-auto p-6 data-[side=right]:w-[88vw] data-[side=right]:max-w-sm"
			>
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<div className="mt-8">
					<MobileSearchInput onNavigate={close} />
				</div>
				<ul className="mt-6 flex flex-col gap-3 text-lg font-bold uppercase text-ink">
					<li>
						<Link href="/" onClick={close} className="hover:text-tangerine">
							Home
						</Link>
					</li>
					<li>
						<Link href="/products" onClick={close} className="hover:text-tangerine">
							All products
						</Link>
					</li>
					<li>
						<Link href="/products?sort=price-asc" onClick={close} className="hover:text-tangerine">
							Shop by price
						</Link>
					</li>
					{nav.blog && (
						<li>
							<Link href="/blog" onClick={close} className="hover:text-tangerine">
								Blog
							</Link>
						</li>
					)}
					<li>
						<Link href="/about" onClick={close} className="hover:text-tangerine">
							About us
						</Link>
					</li>
				</ul>
				<div className="mt-6 flex flex-col gap-5 pb-8">
					<MenuSection title="Categories" items={nav.categories} onNavigate={close} />
					<MenuSection title="Collections" items={nav.collections} onNavigate={close} />
				</div>
			</SheetContent>
		</Sheet>
	);
}
