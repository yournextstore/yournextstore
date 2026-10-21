"use client";

import { ArrowLeft, ArrowRight, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

export type NavLink = {
	href: string;
	label: string;
};

export type MenuCategory = {
	name: string;
	slug: string;
	image: string | null;
};

export type MenuProduct = {
	slug: string;
	name: string;
	image: string | null;
	price: string | null;
};

type NavData = {
	storeName: string;
	links: NavLink[];
	categories: MenuCategory[];
	products: MenuProduct[];
};

/** Desktop nav: bold uppercase links, "Shop" opens Blueprint's full-width mega menu. */
export function DesktopNav({ links, categories }: Pick<NavData, "links" | "categories">) {
	const [open, setOpen] = useState(false);
	const tiles = categories.filter((category) => category.image).slice(0, 2);

	return (
		<nav aria-label="Main" className="hidden h-full items-center lg:flex">
			<ul className="flex h-full items-center gap-7">
				{categories.length > 0 && (
					// Opens on hover through CSS (group-hover) and on click/keyboard through state.
					<li className="group/shop flex h-full items-center">
						<button
							type="button"
							aria-expanded={open}
							aria-controls="shop-menu"
							onClick={() => setOpen((value) => !value)}
							className={cn(
								"bp-nav relative flex h-full items-center after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-foreground after:opacity-0 after:transition-opacity group-hover/shop:after:opacity-100",
								open && "after:opacity-100",
							)}
						>
							Shop
						</button>
						<div
							id="shop-menu"
							className={cn(
								"invisible absolute inset-x-0 top-full border-t border-border bg-background opacity-0 shadow-[0_8px_16px_-12px_rgb(0_0_0/0.25)] transition-[opacity,visibility] duration-150 group-hover/shop:visible group-hover/shop:opacity-100 group-focus-within/shop:visible group-focus-within/shop:opacity-100",
								open && "visible opacity-100",
							)}
						>
							<div className="bp-container grid grid-cols-[minmax(12rem,1fr)_3fr] gap-10 py-8">
								<div className="flex flex-col items-start gap-3 pl-[min(12vw,10rem)]">
									<ul className="flex flex-col gap-2">
										{categories.map((category) => (
											<li key={category.slug}>
												<Link
													href={`/category/${category.slug}`}
													onClick={() => setOpen(false)}
													className="hover-underline text-sm capitalize"
												>
													{category.name}
												</Link>
											</li>
										))}
									</ul>
									<Link href="/products" onClick={() => setOpen(false)} className="bp-btn bp-btn-sm mt-2">
										Shop all
									</Link>
								</div>
								<ul className="flex gap-5">
									{tiles.map((category) => (
										<li key={category.slug} className="w-[min(100%,25rem)]">
											<Link
												href={`/category/${category.slug}`}
												onClick={() => setOpen(false)}
												className="group/tile block"
											>
												<span className="relative block aspect-[16/9] overflow-hidden bg-neutral-lightest">
													{category.image && (
														<YNSMedia
															src={category.image}
															alt=""
															fill
															sizes="400px"
															className="object-cover object-[50%_30%] transition-transform duration-500 group-hover/tile:scale-105"
														/>
													)}
												</span>
												<span className="mt-2 block text-xs capitalize">{category.name}</span>
											</Link>
										</li>
									))}
								</ul>
							</div>
						</div>
					</li>
				)}
				{links.map((link) => (
					<li key={link.href} className="flex h-full items-center">
						<Link
							href={link.href}
							className="bp-nav relative flex h-full items-center after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-foreground after:opacity-0 after:transition-opacity hover:after:opacity-100"
						>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}

/** Mobile drawer: bordered uppercase rows, "Shop" slides to its own panel, best sellers below. */
export function MobileMenu({ storeName, links, categories, products }: NavData) {
	const [open, setOpen] = useState(false);
	const [panel, setPanel] = useState<"main" | "shop">("main");
	const close = () => {
		setOpen(false);
		setPanel("main");
	};

	return (
		<Sheet
			open={open}
			onOpenChange={(value) => {
				setOpen(value);
				if (!value) setPanel("main");
			}}
		>
			<SheetTrigger asChild>
				<button
					type="button"
					aria-label="Open menu"
					className="-ml-2 flex size-10 items-center justify-center lg:hidden"
				>
					<Menu className="size-6" strokeWidth={1.5} aria-hidden />
				</button>
			</SheetTrigger>
			<SheetContent
				side="left"
				hideClose
				className="block w-full gap-0 overflow-y-auto border-0 p-0 sm:max-w-md"
			>
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<SheetDescription className="sr-only">Browse the store</SheetDescription>
				<div className="sticky top-0 z-10 grid h-[4.5rem] grid-cols-[1fr_auto_1fr] items-center border-b border-border bg-background px-4">
					<button
						type="button"
						onClick={close}
						aria-label="Close menu"
						className="-ml-2 flex size-10 items-center justify-center"
					>
						<X className="size-6" strokeWidth={1.5} aria-hidden />
					</button>
					<Link href="/" onClick={close} className="max-w-[12rem] truncate text-lg font-bold lowercase">
						{storeName}
					</Link>
					<span />
				</div>
				<div className="px-4 pt-4">
					<MobileSearchInput onNavigate={close} />
				</div>
				{panel === "main" ? (
					<>
						<ul className="mt-4 border-t border-border">
							{categories.length > 0 && (
								<li className="border-b border-border">
									<button
										type="button"
										onClick={() => setPanel("shop")}
										className="bp-nav flex h-14 w-full items-center justify-between px-4 text-base"
									>
										Shop
										<ArrowRight className="size-6" strokeWidth={1.25} aria-hidden />
									</button>
								</li>
							)}
							{links.map((link) => (
								<li key={link.href} className="border-b border-border">
									<Link
										href={link.href}
										onClick={close}
										className="bp-nav flex h-14 items-center px-4 text-base"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
						{products.length > 0 && (
							<div className="py-8">
								<h2 className="px-4 text-lg font-bold">Best Sellers</h2>
								<ul className="no-scrollbar mt-4 flex snap-x gap-4 overflow-x-auto scroll-px-4 px-4">
									{products.map((product) => (
										<li key={product.slug} className="w-[70%] shrink-0 snap-start">
											<Link href={`/product/${product.slug}`} onClick={close} className="block">
												<span className="relative block aspect-[3/4] overflow-hidden bg-neutral-lightest">
													{product.image && (
														<YNSMedia
															src={product.image}
															alt=""
															fill
															sizes="260px"
															className="object-cover"
														/>
													)}
												</span>
												<span className="mt-3 block text-base font-bold leading-snug">{product.name}</span>
												{product.price && <span className="mt-1 block text-base">{product.price}</span>}
											</Link>
										</li>
									))}
								</ul>
							</div>
						)}
					</>
				) : (
					<div className="mt-4">
						<button
							type="button"
							onClick={() => setPanel("main")}
							className="bp-nav flex h-14 w-full items-center gap-3 border-y border-border px-4 text-base"
						>
							<ArrowLeft className="size-6" strokeWidth={1.25} aria-hidden />
							Shop
						</button>
						<ul>
							{categories.map((category) => (
								<li key={category.slug} className="border-b border-border">
									<Link
										href={`/category/${category.slug}`}
										onClick={close}
										className="flex h-14 items-center px-4 text-base capitalize"
									>
										{category.name}
									</Link>
								</li>
							))}
						</ul>
						<div className="p-4">
							<Link href="/products" onClick={close} className="bp-btn w-full">
								Shop all
							</Link>
						</div>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}

/** The search icon opens a drawer with the storefront's live search. */
export function SearchDrawer() {
	const [open, setOpen] = useState(false);
	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button type="button" aria-label="Open search" className="flex size-10 items-center justify-center">
					<Search className="size-5" strokeWidth={1.75} aria-hidden />
				</button>
			</SheetTrigger>
			<SheetContent side="right" hideClose className="block w-full border-0 p-0 sm:max-w-[23.5rem]">
				<SheetTitle className="sr-only">Search</SheetTitle>
				<SheetDescription className="sr-only">Search the store</SheetDescription>
				<div className="grid h-[4.5rem] grid-cols-[1fr_auto_1fr] items-center border-b border-border px-4">
					<button
						type="button"
						onClick={() => setOpen(false)}
						aria-label="Close search"
						className="-ml-2 flex size-10 items-center justify-center"
					>
						<X className="size-6" strokeWidth={1.5} aria-hidden />
					</button>
					<h2 className="text-lg font-bold">Search</h2>
					<span />
				</div>
				<div className="p-4">
					<MobileSearchInput onNavigate={() => setOpen(false)} />
				</div>
			</SheetContent>
		</Sheet>
	);
}
