"use client";

import { ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type NavLink = {
	href: string;
	label: string;
};

export type NavCategory = NavLink & { description: string };

const linkClass = "whitespace-nowrap rounded-md px-3 py-2 text-base transition-colors hover:bg-pill";

/** Desktop row: the original's "Shop" menu (categories) followed by plain links. */
export function DesktopNav({ links, categories }: { links: NavLink[]; categories: NavCategory[] }) {
	const [open, setOpen] = useState(false);

	return (
		<nav aria-label="Main" className="hidden shrink-0 items-center md:flex">
			{/* Opens on hover (CSS) and on click/Enter for keyboard and touch. */}
			<div className="group/shop">
				<button
					type="button"
					aria-expanded={open}
					aria-controls="shop-menu"
					onClick={() => setOpen((value) => !value)}
					onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
					className={cn(linkClass, "flex items-center gap-1")}
				>
					Shop
					<ChevronDown
						className={cn("size-4 transition-transform group-hover/shop:rotate-180", open && "rotate-180")}
						aria-hidden
					/>
				</button>
				<div
					id="shop-menu"
					className={cn(
						"invisible absolute top-[calc(100%-1.5rem)] left-1/2 z-50 w-[min(600px,calc(100vw-2rem))] -translate-x-1/2 pt-7 opacity-0 transition-opacity group-hover/shop:visible group-hover/shop:opacity-100",
						open && "visible opacity-100",
					)}
				>
					<ul className="grid w-full grid-cols-2 gap-1 rounded-[20px] border border-black/10 bg-background p-3 shadow-lg">
						<li>
							<Link
								href="/products"
								onClick={() => setOpen(false)}
								className="block rounded-xl p-3 transition-colors hover:bg-pill"
							>
								<span className="block text-sm font-bold">All products</span>
								<span className="mt-1 block text-sm text-muted-foreground">
									The whole catalogue, newest first
								</span>
							</Link>
						</li>
						{categories.map((category) => (
							<li key={category.href}>
								<Link
									href={category.href}
									onClick={() => setOpen(false)}
									className="block rounded-xl p-3 transition-colors hover:bg-pill"
								>
									<span className="capitalize-first block text-sm font-bold">{category.label}</span>
									<span className="mt-1 line-clamp-2 block text-sm text-muted-foreground">
										{category.description}
									</span>
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
			{links.map((link) => (
				<Link key={link.href} href={link.href} className={linkClass}>
					{link.label}
				</Link>
			))}
		</nav>
	);
}

/** Phone menu: left sheet with the store name, search, a Shop accordion and the plain links. */
export function Navbar({
	links,
	categories,
	storeName,
}: {
	links: NavLink[];
	categories: NavCategory[];
	storeName: string;
}) {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button type="button" aria-label="Open menu" className="-ml-1 shrink-0 p-1 md:hidden">
					<Menu className="size-6" strokeWidth={2} />
				</button>
			</SheetTrigger>
			<SheetContent side="left" className="block w-[75vw] max-w-sm overflow-y-auto p-6">
				<SheetTitle asChild>
					<Link
						href="/"
						onClick={close}
						className="font-display block pr-8 text-center text-2xl leading-none"
					>
						{storeName}
					</Link>
				</SheetTitle>
				<div className="mt-8">
					<MobileSearchInput onNavigate={close} />
				</div>
				<nav aria-label="Mobile" className="mt-6 flex flex-col items-start">
					<Accordion type="single" collapsible className="mb-1 w-full">
						<AccordionItem value="shop" className="border-none">
							<AccordionTrigger className="py-2 text-base font-normal hover:no-underline">
								Shop
							</AccordionTrigger>
							<AccordionContent className="flex flex-col border-l border-black/10 pb-2 pl-4">
								<Link href="/products" onClick={close} className="py-2 text-base">
									All products
								</Link>
								{categories.map((category) => (
									<Link
										key={category.href}
										href={category.href}
										onClick={close}
										className="capitalize-first inline-block py-2 text-base"
									>
										{category.label}
									</Link>
								))}
							</AccordionContent>
						</AccordionItem>
					</Accordion>
					{links.map((link) => (
						<Link key={link.href} href={link.href} onClick={close} className="py-2 text-base">
							{link.label}
						</Link>
					))}
				</nav>
			</SheetContent>
		</Sheet>
	);
}
