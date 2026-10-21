"use client";

import Link from "next/link";
import { useState } from "react";
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
import { YNSMedia } from "@/lib/yns-media";

export type NavLink = {
	href: string;
	label: string;
};

export type NavCollection = {
	id: string;
	name: string;
	href: string;
	background: string;
	ink: string;
	shape: string;
};

export type NavProduct = {
	id: string;
	name: string;
	href: string;
	image: string | null;
	category: string | null;
	price: string | null;
	compareAt: string | null;
};

export type MenuData = {
	links: NavLink[];
	collections: NavCollection[];
	products: NavProduct[];
	accountHref: string;
};

function CloseIcon() {
	return (
		<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none">
			<path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.5" />
		</svg>
	);
}

function MenuIcon() {
	return (
		<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none">
			<path d="M2 6h20M2 12h20M2 18h20" stroke="currentColor" strokeWidth="1.5" />
		</svg>
	);
}

function ProductsIcon() {
	return (
		<svg aria-hidden="true" className="mr-0.5 w-6" width="25" height="25" viewBox="0 0 25 25" fill="none">
			<rect x="5" y="14" width="6" height="6" stroke="currentColor" strokeWidth="1.2" />
			<rect x="14" y="5" width="6" height="6" stroke="currentColor" strokeWidth="1.2" />
			<circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.2" />
			<circle cx="17" cy="17" r="3" stroke="currentColor" strokeWidth="1.2" />
		</svg>
	);
}

/** Collection tiles in the panel: a pastel card with the collection's shape inked in, name in white. */
function CollectionCard({ collection, onClick }: { collection: NavCollection; onClick: () => void }) {
	return (
		<Link
			href={collection.href}
			onClick={onClick}
			className="group relative flex aspect-[4/3] items-center justify-center rounded-md p-3 transition-[border-radius] duration-500 ease-out hover:rounded-xl"
			style={{ background: collection.background }}
		>
			<span
				aria-hidden="true"
				className={cn(
					"absolute inset-y-2 left-2 right-1 duration-1000 ease-out group-hover:scale-[1.03]",
					collection.shape,
				)}
				style={{ background: collection.ink }}
			/>
			<span className="relative line-clamp-3 max-w-[70%] text-center text-ui-lg font-bold text-white group-hover:underline">
				{collection.name}
			</span>
		</Link>
	);
}

function ProductPill({ product, onClick }: { product: NavProduct; onClick: () => void }) {
	return (
		<Link
			href={product.href}
			onClick={onClick}
			className="group flex h-[108px] gap-4 rounded-md border border-lightgray bg-white p-3 text-ui-sm duration-500 ease-out hover:rounded-lg hover:border-darkgray"
		>
			<span className="relative h-full w-[110px] shrink-0 overflow-hidden rounded-sm bg-lightgray duration-500 ease-out group-hover:rounded-md">
				{product.image && <YNSMedia src={product.image} alt="" fill sizes="110px" className="object-cover" />}
				{product.compareAt && (
					<span className="absolute top-2 left-2 rounded-sm bg-white px-1.5 py-1 text-ui-xs leading-none text-sale">
						Sale
					</span>
				)}
			</span>
			<span className="min-w-0 overflow-hidden">
				<span className="block truncate font-bold group-hover:underline">{product.name}</span>
				{product.category && <span className="mt-1 block truncate text-darkgray">{product.category}</span>}
				<span className="mt-3 flex font-bold">
					{product.compareAt && (
						<s className="mr-2.5 text-darkgray decoration-sale-line">
							<span className="sr-only">Was </span>
							{product.compareAt}
						</s>
					)}
					{product.price}
				</span>
			</span>
		</Link>
	);
}

/** The original's "Products" button: opens a left panel of collection tiles and newest products. */
export function ProductsPanel({ collections, products }: Pick<MenuData, "collections" | "products">) {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button
					type="button"
					className="-mx-3 flex h-[2.4rem] items-center rounded-sm py-2 pr-3 pl-2 font-bold duration-150 hover:bg-darkgray/10"
				>
					<ProductsIcon />
					Products
				</button>
			</SheetTrigger>
			<SheetContent
				side="left"
				showClose={false}
				className="block w-full overflow-y-auto rounded-r-lg border-0 pb-10 sm:max-w-none md:w-[490px]"
			>
				<div className="flex h-header-sm items-center justify-between px-8 lg:h-header-lg">
					<SheetTitle className="text-ui-xl font-bold">Products</SheetTitle>
					<SheetClose className="-mr-2 p-2 duration-200 hover:opacity-50" aria-label="Close">
						<CloseIcon />
					</SheetClose>
				</div>
				<SheetDescription className="sr-only">Browse collections and our newest products.</SheetDescription>
				<div className="px-8">
					<MobileSearchInput onNavigate={close} />
				</div>
				{collections.length > 0 && (
					<div className="mt-8 px-8">
						<div className="text-ui-lg font-bold">Collections</div>
						<div className="mt-3 grid grid-cols-2 gap-2">
							{collections.map((collection) => (
								<CollectionCard key={collection.id} collection={collection} onClick={close} />
							))}
						</div>
					</div>
				)}
				{products.length > 0 && (
					<div className="mt-8 px-8">
						<div className="text-ui-lg font-bold">New arrivals</div>
						<ul className="mt-3 grid grid-cols-1 gap-2">
							{products.map((product) => (
								<li key={product.id}>
									<ProductPill product={product} onClick={close} />
								</li>
							))}
						</ul>
						<Link
							href="/products"
							onClick={close}
							className="mt-6 inline-flex font-bold underline hover:no-underline"
						>
							View all products
						</Link>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}

export function DesktopNav({ links, collections, products }: Omit<MenuData, "accountHref">) {
	return (
		<nav
			aria-label="Main"
			className="relative hidden items-stretch justify-start gap-6 text-ui-sm font-bold lg:flex"
		>
			<div className="flex items-center">
				<ProductsPanel collections={collections} products={products} />
			</div>
			{links.map((link) => (
				<div key={link.href} className="flex items-center">
					<Link href={link.href} className="link-underline whitespace-nowrap">
						{link.label}
					</Link>
				</div>
			))}
		</nav>
	);
}

/** Full-screen white menu with the original's oversized bold links. */
export function MobileMenu({ links, collections, accountHref }: Omit<MenuData, "products">) {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button
					type="button"
					aria-label="Open menu"
					className="-ml-4 flex h-header-sm items-center p-4 duration-200 hover:opacity-50 md:-ml-4 lg:hidden"
				>
					<MenuIcon />
				</button>
			</SheetTrigger>
			<SheetContent
				side="left"
				showClose={false}
				className="block w-full overflow-y-auto border-0 pb-40 sm:max-w-none"
			>
				<div className="flex h-header-sm items-center px-4">
					<SheetClose className="-ml-4 h-header-sm p-4" aria-label="Close menu">
						<CloseIcon />
					</SheetClose>
				</div>
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<SheetDescription className="sr-only">Site navigation</SheetDescription>
				<nav aria-label="Mobile" className="mt-6 space-y-1 px-4 text-ui-2xl font-bold">
					<Link href="/" onClick={close} className="link-underline block">
						Home
					</Link>
					<div>
						<Link href="/products" onClick={close} className="link-underline">
							Products –
						</Link>
						<div className="my-1 ml-8 space-y-1">
							{collections.map((collection) => (
								<Link
									key={collection.id}
									href={collection.href}
									onClick={close}
									className="link-underline block truncate"
								>
									{collection.name}
								</Link>
							))}
						</div>
					</div>
					{links.map((link) => (
						<Link key={link.href} href={link.href} onClick={close} className="link-underline block">
							{link.label}
						</Link>
					))}
				</nav>
				<div className="mt-6 space-y-6 px-4">
					{/* Plain <a>: /account is a proxied zone (see AGENTS.md). */}
					<a href={accountHref} className="link-underline block px-1 text-ui-sm font-bold">
						Account
					</a>
					<MobileSearchInput onNavigate={close} />
				</div>
			</SheetContent>
		</Sheet>
	);
}
