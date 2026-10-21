"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronIcon, CloseIcon } from "@/components/icons";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import type { MenuItem } from "@/lib/catalog";
import { YNSMedia } from "@/lib/yns-media";

/** Desktop mega menu: hover or focus a category to drop its full-width panel under the header. */
export function MegaMenu({ items }: { items: MenuItem[] }) {
	return (
		<nav aria-label="Main" className="hidden lg:block">
			<ul className="flex items-center gap-4">
				{items.map((item) => (
					<li key={item.href} className="group/menu">
						<Link
							href={item.href}
							className="flex items-center gap-0.5 py-2 text-sm/[18px] whitespace-nowrap text-ink"
						>
							{item.label}
							{item.submenu && (
								<ChevronIcon className="size-4 transition-transform duration-200 group-hover/menu:-rotate-180 group-focus-within/menu:-rotate-180" />
							)}
						</Link>
						{item.submenu && (
							<div className="invisible absolute inset-x-0 top-full z-40 border-b border-black/10 bg-white opacity-0 shadow-sm transition-all duration-200 group-hover/menu:visible group-hover/menu:opacity-100 group-focus-within/menu:visible group-focus-within/menu:opacity-100 before:absolute before:inset-x-0 before:-top-5 before:h-5">
								{item.submenu.variant === "text" ? (
									<div className="shop-container grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8 py-14">
										{item.submenu.columns.map((column) => (
											<div key={column.href} className="flex flex-col gap-4">
												<Link
													href={column.href}
													className="text-[22px] font-semibold underline-offset-4 hover:underline"
												>
													{column.label}
												</Link>
												{column.links.length > 0 && (
													<ul className="flex flex-col gap-2">
														{column.links.map((link) => (
															<li key={link.href}>
																<Link href={link.href} className="underline-offset-4 hover:underline">
																	{link.label}
																</Link>
															</li>
														))}
													</ul>
												)}
											</div>
										))}
									</div>
								) : (
									<div className="shop-container grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8 py-14">
										{item.submenu.links.map((link) => (
											<Link
												key={link.href}
												href={link.href}
												className="group/tile flex flex-col items-center gap-4"
											>
												<span className="relative block h-[150px] w-[200px] overflow-hidden rounded-md bg-neutral-200">
													{link.image && (
														<YNSMedia
															src={link.image}
															alt=""
															fill
															sizes="200px"
															className="object-cover transition-transform duration-300 group-hover/tile:scale-105"
														/>
													)}
												</span>
												<span className="text-center text-xl text-slate-800 group-hover/tile:underline">
													{link.label}
												</span>
											</Link>
										))}
									</div>
								)}
							</div>
						)}
					</li>
				))}
			</ul>
		</nav>
	);
}

/** Mobile drawer: slides in from the left; a category with a dropdown drills into its own list. */
export function MobileMenu({ items, storeName }: { items: MenuItem[]; storeName: string }) {
	const [open, setOpen] = useState(false);
	const [activeHref, setActiveHref] = useState<string | null>(null);
	const active = items.find((item) => item.href === activeHref);
	const close = () => setOpen(false);

	return (
		<Sheet
			open={open}
			onOpenChange={(next) => {
				setOpen(next);
				if (!next) setActiveHref(null);
			}}
		>
			<SheetTrigger asChild>
				<button
					type="button"
					aria-label="Open menu"
					className="relative mr-5 flex h-5 w-[25px] shrink-0 items-center lg:hidden"
				>
					<span className="absolute top-0 left-0 h-0.5 w-full rounded-full bg-ink" />
					<span className="absolute top-2 left-0 h-0.5 w-[70%] rounded-full bg-ink" />
					<span className="absolute top-4 left-0 h-0.5 w-full rounded-full bg-ink" />
				</button>
			</SheetTrigger>
			<SheetContent
				side="left"
				showCloseButton={false}
				className="block w-[350px] max-w-full overflow-y-auto border-0 bg-white p-0 sm:max-w-[350px]"
			>
				<SheetTitle className="sr-only">{storeName} menu</SheetTitle>
				<SheetDescription className="sr-only">Browse the store's categories</SheetDescription>
				<div className="flex h-16 items-center justify-between px-4">
					{active ? (
						<button
							type="button"
							onClick={() => setActiveHref(null)}
							className="-ml-1 flex items-center gap-2 font-medium"
						>
							<ChevronIcon className="size-6 rotate-90" />
							{active.label}
						</button>
					) : (
						<span className="text-xl font-bold">{storeName}</span>
					)}
					<SheetClose aria-label="Close menu" className="p-1">
						<CloseIcon className="size-5" />
					</SheetClose>
				</div>

				{active?.submenu ? (
					<div className="flex flex-col gap-6 px-4 pt-4 pb-10">
						<Link href={active.href} onClick={close} className="text-[22px] underline underline-offset-4">
							All {active.label}
						</Link>
						{active.submenu.variant === "text" ? (
							active.submenu.columns.map((column) => (
								<div key={column.href} className="flex flex-col gap-3">
									<Link href={column.href} onClick={close} className="text-[22px] font-semibold">
										{column.label}
									</Link>
									{column.links.map((link) => (
										<Link key={link.href} href={link.href} onClick={close} className="text-base">
											{link.label}
										</Link>
									))}
								</div>
							))
						) : (
							<div className="grid grid-cols-2 gap-4">
								{active.submenu.links.map((link) => (
									<Link key={link.href} href={link.href} onClick={close} className="flex flex-col gap-2">
										<span className="relative block aspect-[4/3] overflow-hidden rounded-md bg-neutral-200">
											{link.image && (
												<YNSMedia src={link.image} alt="" fill sizes="160px" className="object-cover" />
											)}
										</span>
										<span className="text-sm text-slate-800">{link.label}</span>
									</Link>
								))}
							</div>
						)}
					</div>
				) : (
					<nav aria-label="Main" className="px-4 pt-6 pb-10">
						<ul className="flex flex-col gap-4">
							<li>
								<Link href="/products" onClick={close} className="block text-[22px] text-ink">
									All Products
								</Link>
							</li>
							{items.map((item) => (
								<li key={item.href}>
									{item.submenu ? (
										<button
											type="button"
											onClick={() => setActiveHref(item.href)}
											className="flex w-full items-center justify-between text-left text-[22px] text-ink"
										>
											{item.label}
											<ChevronIcon className="size-5 -rotate-90" />
										</button>
									) : (
										<Link href={item.href} onClick={close} className="block text-[22px] text-ink">
											{item.label}
										</Link>
									)}
								</li>
							))}
							<li>
								<Link href="/about" onClick={close} className="block text-[22px] text-ink">
									About
								</Link>
							</li>
						</ul>
					</nav>
				)}
			</SheetContent>
		</Sheet>
	);
}
