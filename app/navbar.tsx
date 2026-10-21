"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
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

type NavData = {
	storeName: string;
	links: NavLink[];
	categories: MenuCategory[];
};

const NAV_ITEM =
	"relative -mb-px flex h-full items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200";

/** A featured category tile of the mega menu: square photo, name, "Shop now". */
function FeatureTile({ category, onNavigate }: { category: MenuCategory; onNavigate: () => void }) {
	return (
		<div className="group/tile relative text-sm">
			<div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 group-hover/tile:opacity-75">
				{category.image && (
					<YNSMedia
						src={category.image}
						alt=""
						fill
						sizes="280px"
						className="object-cover object-[50%_25%]"
					/>
				)}
			</div>
			<Link
				href={`/category/${category.slug}`}
				onClick={onNavigate}
				className="mt-6 block text-base font-bold text-ink"
			>
				<span aria-hidden className="absolute inset-0 z-10" />
				{category.name}
			</Link>
			<p aria-hidden className="mt-1 text-muted-foreground">
				Shop now
			</p>
		</div>
	);
}

/**
 * Desktop nav: the original's store navigation. "Categories" opens a full-width panel with
 * two featured photo tiles on the right and the category list on the left.
 */
export function DesktopNav({ links, categories }: Pick<NavData, "links" | "categories">) {
	const [open, setOpen] = useState(false);
	// A hover opens the panel first; the click that follows must not toggle it shut again.
	const hoverOpened = useRef(false);
	const featured = categories.filter((category) => category.image).slice(0, 2);
	const close = () => setOpen(false);

	return (
		<nav aria-label="Main" className="hidden lg:ml-8 lg:block lg:self-stretch">
			<ul className="flex h-full gap-8">
				{categories.length > 0 && (
					<li className="group/menu flex">
						<button
							type="button"
							aria-expanded={open}
							aria-controls="category-menu"
							onMouseEnter={() => {
								if (!open) hoverOpened.current = true;
							}}
							onClick={() => {
								if (hoverOpened.current) {
									hoverOpened.current = false;
									setOpen(true);
									return;
								}
								setOpen((value) => !value);
							}}
							className={cn(
								NAV_ITEM,
								open
									? "border-sky text-ink"
									: "border-transparent text-gray-700 hover:text-gray-900 group-hover/menu:border-sky",
							)}
						>
							Categories
						</button>
						<div
							id="category-menu"
							className={cn(
								"invisible absolute inset-x-0 top-full z-40 text-sm text-muted-foreground opacity-0 transition-[opacity,visibility] duration-150 group-hover/menu:visible group-hover/menu:opacity-100 group-focus-within/menu:visible group-focus-within/menu:opacity-100",
								open && "visible opacity-100",
							)}
						>
							<div aria-hidden className="absolute inset-0 top-1/2 bg-white shadow" />
							<div className="relative border-t border-border bg-white">
								<div className="mx-auto max-w-7xl px-8">
									<div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
										<div className="col-start-2 grid grid-cols-2 gap-x-8">
											{featured.map((category) => (
												<FeatureTile key={category.slug} category={category} onNavigate={close} />
											))}
										</div>
										<div className="row-start-1 grid grid-cols-2 gap-x-8 gap-y-10 text-sm">
											<div>
												<p className="font-medium text-gray-900">Categories</p>
												<ul className="mt-6 space-y-6">
													{categories.map((category) => (
														<li key={category.slug} className="flex">
															<Link
																href={`/category/${category.slug}`}
																onClick={close}
																className="hover:text-gray-800"
															>
																{category.name}
															</Link>
														</li>
													))}
												</ul>
											</div>
											<div>
												<p className="font-medium text-gray-900">Shop</p>
												<ul className="mt-6 space-y-6">
													<li className="flex">
														<Link href="/products" onClick={close} className="hover:text-gray-800">
															All products
														</Link>
													</li>
													<li className="flex">
														<Link
															href="/products?sort=price-asc"
															onClick={close}
															className="hover:text-gray-800"
														>
															Best prices
														</Link>
													</li>
													<li className="flex">
														<Link href="/search" onClick={close} className="hover:text-gray-800">
															Search
														</Link>
													</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</li>
				)}
				{links.map((link) => (
					<li key={link.href} className="flex">
						<Link
							href={link.href}
							className={cn(NAV_ITEM, "border-transparent text-gray-700 hover:text-gray-900")}
						>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}

/** Mobile drawer: the original's left panel, featured tiles over the category list and links. */
export function MobileMenu({ links, categories }: NavData) {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);
	const featured = categories.filter((category) => category.image).slice(0, 2);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				aria-label="Open menu"
				className="relative -ml-2 flex size-10 items-center justify-center rounded-md text-subtle lg:hidden"
			>
				<Menu className="size-6" strokeWidth={1.5} aria-hidden />
			</SheetTrigger>
			<SheetContent
				side="left"
				showCloseButton={false}
				className="block gap-0 overflow-y-auto border-0 p-0 pb-12 shadow-xl data-[side=left]:w-full data-[side=left]:max-w-xs data-[side=left]:border-0 data-[side=left]:sm:max-w-xs"
			>
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<SheetDescription className="sr-only">Browse the store</SheetDescription>
				<div className="flex px-4 pb-2 pt-5">
					<button
						type="button"
						onClick={close}
						aria-label="Close menu"
						className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-muted-foreground"
					>
						<X className="size-6" strokeWidth={1.5} aria-hidden />
					</button>
				</div>
				<div className="px-4 pt-4">
					<MobileSearchInput onNavigate={close} />
				</div>
				{categories.length > 0 && (
					<div className="mt-6 border-b border-border px-4 pb-2">
						<p className="inline-block border-b-2 border-sky pb-3 text-base font-medium text-ink">
							Categories
						</p>
					</div>
				)}
				{categories.length > 0 && (
					<div className="space-y-10 px-4 pb-8 pt-8">
						{featured.length > 0 && (
							<div className="grid grid-cols-2 gap-x-4">
								{featured.map((category) => (
									<FeatureTile key={category.slug} category={category} onNavigate={close} />
								))}
							</div>
						)}
						<ul className="flex flex-col space-y-6">
							{categories.map((category) => (
								<li key={category.slug} className="flow-root">
									<Link
										href={`/category/${category.slug}`}
										onClick={close}
										className="-m-2 block p-2 text-muted-foreground"
									>
										{category.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
				)}
				<ul className="space-y-6 border-t border-border px-4 py-6">
					{links.map((link) => (
						<li key={link.href} className="flow-root">
							<Link href={link.href} onClick={close} className="-m-2 block p-2 font-medium text-gray-900">
								{link.label}
							</Link>
						</li>
					))}
				</ul>
			</SheetContent>
		</Sheet>
	);
}
