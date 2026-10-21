"use client";

import { ChevronDown, Menu, Minus, Plus, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import type { ShelfLink } from "@/lib/shop";

type MenuProps = {
	categories: ShelfLink[];
	collections: ShelfLink[];
};

function ShelfGroup({
	title,
	links,
	onNavigate,
	defaultOpen = false,
	className,
}: {
	title: string;
	links: ShelfLink[];
	onNavigate: () => void;
	defaultOpen?: boolean;
	className?: string;
}) {
	if (links.length === 0) {
		return null;
	}
	return (
		<details className={`group/shelf ${className ?? ""}`} open={defaultOpen}>
			<summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 pl-2 pr-2 [&::-webkit-details-marker]:hidden">
				<span className="font-serif text-lg font-medium">{title}</span>
				<Plus aria-hidden="true" className="h-5 w-5 group-open/shelf:hidden" strokeWidth={1.75} />
				<Minus aria-hidden="true" className="hidden h-5 w-5 group-open/shelf:block" strokeWidth={1.75} />
			</summary>
			<ul className="flex flex-col gap-y-1 pb-4 pl-2">
				{links.map((link) => (
					<li key={link.href}>
						<Link
							href={link.href}
							onClick={onNavigate}
							className="link-dashed inline-block py-1 text-base text-foreground/85 hover:text-foreground"
						>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</details>
	);
}

function FeatureLink({
	href,
	title,
	children,
	onNavigate,
}: {
	href: string;
	title: string;
	children: React.ReactNode;
	onNavigate: () => void;
}) {
	return (
		<Link href={href} onClick={onNavigate} className="group block rounded-sm p-2 hover:bg-muted">
			<span className="block font-serif text-lg font-medium group-hover:underline">{title}</span>
			<span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{children}</span>
		</Link>
	);
}

/** Desktop "Category" mega menu (original NavigationMenu content: two feature links + collapsible groups). */
export function CategoryMenu({ categories, collections }: MenuProps) {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger className="nav-underline flex items-center gap-1 px-1 py-1">
				Category
				<ChevronDown
					aria-hidden="true"
					className={`h-5 w-5 transition-transform duration-200 ${open ? "-rotate-180" : ""}`}
					strokeWidth={2}
				/>
			</PopoverTrigger>
			<PopoverContent
				// Hang the panel under the whole nav, right edge on the container (the nav's labels are
				// fixed copy, so the distance from this trigger to that edge is constant).
				align="start"
				alignOffset={-430}
				sideOffset={18}
				collisionPadding={16}
				className="w-[min(54rem,calc(100vw-2rem))] rounded-none border-shelf bg-popover p-4 shadow-lg"
			>
				<div className="flex gap-x-4">
					<div className="flex basis-1/2 flex-col gap-y-3">
						<FeatureLink href="/products" title="All Products" onNavigate={close}>
							Wander every shelf at once and discover the books that have won the hearts of our regulars
						</FeatureLink>
						<FeatureLink href="/products?sort=newest" title="New Arrivals" onNavigate={close}>
							Explore the latest and greatest additions, fresh in and waiting to be found
						</FeatureLink>
					</div>
					<div className="max-h-[60vh] basis-1/2 divide-y divide-rule overflow-y-auto">
						<ShelfGroup title="Categories" links={categories} onNavigate={close} defaultOpen />
						<ShelfGroup title="Collections" links={collections} onNavigate={close} />
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}

/** Mobile slide-in menu from the left (original mobile navigation). */
export function MobileMenu({
	storeName,
	tagline,
	categories,
	collections,
	accountHref,
	contactForm,
}: MenuProps & { storeName: string; tagline: string; accountHref: string; contactForm: boolean }) {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);
	const rowClass = "flex w-full items-center gap-x-2 px-2 py-2 text-xl";

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button type="button" aria-label="Open menu" className="-ml-1 p-1 md:hidden">
					<Menu aria-hidden="true" className="h-6 w-6" strokeWidth={1.75} />
				</button>
			</SheetTrigger>
			<SheetContent
				side="left"
				hideClose
				className="block w-10/12 max-w-sm overflow-y-auto border-r-0 bg-background p-4 sm:max-w-sm"
			>
				<div className="flex justify-end">
					<SheetClose className="p-1" aria-label="Close menu">
						<X aria-hidden="true" className="h-6 w-6" strokeWidth={1.75} />
					</SheetClose>
				</div>
				<div className="flex flex-col items-center gap-2 text-center">
					<SheetTitle className="font-serif text-2xl font-medium">{storeName}</SheetTitle>
					<SheetDescription className="text-base text-foreground">{tagline}</SheetDescription>
				</div>
				<nav aria-label="Mobile" className="mt-4 mb-6 divide-y divide-rule">
					<Link href="/" onClick={close} className={rowClass}>
						Home
					</Link>
					<details className="group/cat">
						<summary
							className={`${rowClass} cursor-pointer list-none justify-between [&::-webkit-details-marker]:hidden`}
						>
							Category
							<ChevronDown
								aria-hidden="true"
								className="h-5 w-5 transition-transform group-open/cat:-rotate-180"
								strokeWidth={2}
							/>
						</summary>
						<div className="divide-y divide-rule border-t border-rule bg-muted/60 px-2">
							<Link
								href="/products"
								onClick={close}
								className="block py-3 pl-2 font-serif text-lg font-medium"
							>
								All Products
							</Link>
							<ShelfGroup title="Categories" links={categories} onNavigate={close} defaultOpen />
							<ShelfGroup title="Collections" links={collections} onNavigate={close} />
						</div>
					</details>
					{/* Plain <a>: /account is a proxied zone — soft navigation 500s. */}
					<a href={accountHref} className={rowClass}>
						Account
					</a>
					<Link href="/about" onClick={close} className={rowClass}>
						About Us
					</Link>
					{contactForm ? (
						<Link href="/contact" onClick={close} className={rowClass}>
							Contact Us
						</Link>
					) : null}
					<Link href="/faq" onClick={close} className={rowClass}>
						FAQ
					</Link>
				</nav>
			</SheetContent>
		</Sheet>
	);
}

/** Adds the original's header shadow once the page scrolls; renders nothing. */
export function HeaderScrollShadow() {
	useEffect(() => {
		const header = document.querySelector<HTMLElement>(".site-header");
		if (!header) {
			return;
		}
		const update = () => {
			header.dataset.scrolled = window.scrollY > 25 ? "true" : "false";
		};
		update();
		window.addEventListener("scroll", update, { passive: true });
		return () => window.removeEventListener("scroll", update);
	}, []);
	return null;
}
