"use client";

import { ChevronDown, ChevronRight, Menu, ShoppingCart, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/app/cart/cart-context";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { BrandName } from "@/components/wordmark";
import { cn } from "@/lib/utils";

export type NavLink = {
	href: string;
	label: string;
};

export type NavData = {
	storeName: string;
	collections: NavLink[];
	categories: NavLink[];
	blog: boolean;
};

const navLinkClass =
	"inline-flex items-center gap-1 whitespace-nowrap text-base uppercase text-[#333a44] transition-colors hover:text-main";

function ShopColumns({ data, onNavigate }: { data: NavData; onNavigate?: () => void }) {
	const columns = [
		{ title: "Collections", links: data.collections },
		{ title: "Categories", links: data.categories },
	].filter((column) => column.links.length > 0);
	return (
		<>
			{columns.map((column) => (
				<div key={column.title} className="min-w-44">
					<p className="mb-3 font-montserrat text-sm font-bold uppercase tracking-wide text-ink">
						{column.title}
					</p>
					<ul className="space-y-2">
						{column.links.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									onClick={onNavigate}
									className="text-sm text-steel transition-colors hover:text-main"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</div>
			))}
			<div className="min-w-44">
				<p className="mb-3 font-montserrat text-sm font-bold uppercase tracking-wide text-ink">Shop</p>
				<ul className="space-y-2">
					<li>
						<Link href="/products" onClick={onNavigate} className="text-sm text-steel hover:text-main">
							All products
						</Link>
					</li>
					<li>
						<Link
							href="/products?sort=price-asc"
							onClick={onNavigate}
							className="text-sm text-steel hover:text-main"
						>
							Price: low to high
						</Link>
					</li>
				</ul>
			</div>
		</>
	);
}

export function Navbar({ data, accountHref }: { data: NavData; accountHref: string }) {
	const [open, setOpen] = useState(false);
	const [shopOpen, setShopOpen] = useState(false);
	const [mobileShopOpen, setMobileShopOpen] = useState(false);
	const { itemCount, openCart } = useCart();

	return (
		<>
			{/* Desktop: SHOP (mega panel) · ALL PRODUCTS · ABOUT COREX, centred like the original. */}
			<nav
				aria-label="Main"
				className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 lg:flex"
			>
				<div className="group relative">
					<button
						type="button"
						aria-expanded={shopOpen}
						aria-controls="shop-menu"
						onClick={() => setShopOpen((v) => !v)}
						className={cn(navLinkClass, "h-16")}
					>
						Shop
						<ChevronDown className={cn("h-4 w-4 transition-transform", shopOpen && "rotate-180")} />
					</button>
					<div
						id="shop-menu"
						className={cn(
							"absolute left-1/2 top-full z-50 -translate-x-1/2 rounded-b-xl border border-border bg-card px-8 py-6 shadow-[0_12px_32px_rgb(4_38_80/0.14)] transition-[opacity,transform] duration-300 ease-out",
							shopOpen
								? "visible translate-y-0 opacity-100"
								: "invisible -translate-y-2.5 opacity-0 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100",
						)}
					>
						<div className="flex gap-10">
							<ShopColumns data={data} onNavigate={() => setShopOpen(false)} />
						</div>
					</div>
				</div>
				<Link href="/products" className={navLinkClass}>
					All products
				</Link>
				{data.blog && (
					<Link href="/blog" className={navLinkClass}>
						Blog
					</Link>
				)}
				<Link href="/about" className={navLinkClass}>
					About <BrandName name={data.storeName} />
				</Link>
			</nav>

			{/* Mobile: the original's left drawer, "MENU" title, links, then wishlist/account/cart at the foot. */}
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<button
						type="button"
						aria-label="Open menu"
						className="order-last rounded-full p-2 text-ink transition-colors hover:bg-secondary lg:hidden"
					>
						<Menu className="h-6 w-6" strokeWidth={1.75} />
					</button>
				</SheetTrigger>
				<SheetContent side="left" hideClose className="w-full gap-0 bg-page p-0 sm:max-w-sm">
					<div className="flex items-center justify-between border-b border-border px-6 py-5">
						<SheetTitle className="text-xl font-normal uppercase tracking-wide text-main">Menu</SheetTitle>
						<SheetDescription className="sr-only">Site navigation</SheetDescription>
						<SheetClose className="rounded-full p-1 text-ink hover:bg-secondary" aria-label="Close menu">
							<X className="h-5 w-5" />
						</SheetClose>
					</div>
					<div className="flex-1 overflow-y-auto px-6 py-4">
						<MobileSearchInput onNavigate={() => setOpen(false)} />
						<nav aria-label="Mobile" className="mt-4 flex flex-col text-lg text-[#0f2f5c]">
							<button
								type="button"
								aria-expanded={mobileShopOpen}
								onClick={() => setMobileShopOpen((v) => !v)}
								className="flex items-center justify-between py-2.5 text-left"
							>
								Shop
								<ChevronRight className={cn("h-5 w-5 transition-transform", mobileShopOpen && "rotate-90")} />
							</button>
							{mobileShopOpen && (
								<div className="grid gap-6 border-l-2 border-main/30 py-3 pl-4">
									<ShopColumns data={data} onNavigate={() => setOpen(false)} />
								</div>
							)}
							<Link href="/products" onClick={() => setOpen(false)} className="py-2.5">
								All Products
							</Link>
							{data.blog && (
								<Link href="/blog" onClick={() => setOpen(false)} className="py-2.5">
									Blog
								</Link>
							)}
							<Link href="/about" onClick={() => setOpen(false)} className="py-2.5">
								About {data.storeName}
							</Link>
						</nav>
					</div>
					<div className="space-y-1 border-t border-border px-6 py-5 text-lg text-ink">
						<a href={accountHref} className="flex items-center gap-3 py-2">
							<UserRound className="h-5 w-5" strokeWidth={1.75} />
							Account
						</a>
						<button
							type="button"
							onClick={() => {
								setOpen(false);
								openCart();
							}}
							className="flex items-center gap-3 py-2"
						>
							<span className="relative">
								<ShoppingCart className="h-5 w-5" strokeWidth={1.75} />
								{itemCount > 0 && (
									<span className="absolute -top-2.5 -right-2.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-electric px-1 text-xs text-white">
										{itemCount}
									</span>
								)}
							</span>
							Cart
						</button>
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
}
