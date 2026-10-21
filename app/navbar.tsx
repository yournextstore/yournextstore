"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

export type NavLink = {
	href: string;
	label: string;
};

export type NavData = {
	storeName: string;
	promo: string | null;
	shop: NavLink[];
	info: NavLink[];
	legal: NavLink[];
	featured: (NavLink & { image: string | null })[];
};

type Panel = "shop" | "info" | null;

/** Desktop "○ SHOP" mega navigation and "○ INFO" dropdown, as in the original header. */
export function DesktopNav({ nav }: { nav: NavData }) {
	const [open, setOpen] = useState<Panel>(null);

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(null);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open]);

	const toggle = (panel: Exclude<Panel, null>) => setOpen((current) => (current === panel ? null : panel));
	const close = () => setOpen(null);

	return (
		<>
			<nav aria-label="Main" className="hidden items-center md:flex">
				<ul className="flex items-center">
					<li className="mx-2">
						<button
							type="button"
							aria-expanded={open === "shop"}
							aria-controls="mega-shop"
							onClick={() => toggle("shop")}
							className="hull-indicator block cursor-pointer p-2 text-nav font-semibold uppercase"
						>
							Shop
						</button>
					</li>
					<li className="relative mx-2">
						<button
							type="button"
							aria-expanded={open === "info"}
							aria-controls="menu-info"
							onClick={() => toggle("info")}
							className="hull-indicator block cursor-pointer p-2 text-nav font-semibold uppercase"
						>
							Info
						</button>
						<div
							id="menu-info"
							hidden={open !== "info"}
							className="absolute top-full left-0 z-20 min-w-48 border border-border bg-background py-2 whitespace-nowrap"
						>
							<ul>
								{[...nav.info, ...nav.legal].map((link) => (
									<li key={link.href}>
										<Link
											href={link.href}
											onClick={close}
											className="block px-4 py-1.5 text-nav font-semibold uppercase transition-opacity hover:opacity-40"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					</li>
				</ul>
			</nav>

			{/* The mega panel hangs from the header's bottom rule, over a blurred backdrop. */}
			{open === "shop" && (
				<>
					<div
						aria-hidden
						onClick={close}
						className="absolute inset-x-0 top-full hidden h-screen bg-black/40 backdrop-blur-[6px] md:block"
					/>
					<div
						id="mega-shop"
						className="absolute inset-x-0 top-full hidden border-b border-border bg-background md:block"
					>
						<div className="grid grid-cols-2 px-8 pt-1 pb-12">
							<ul>
								{nav.shop.map((link) => (
									<li key={link.href}>
										<Link
											href={link.href}
											onClick={close}
											className="inline-block text-h2 leading-[1.5] transition-opacity duration-200 hover:opacity-40"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
							{nav.featured.length > 0 && (
								<div className="relative grid w-full max-w-[725px] grid-cols-2 gap-4 border-l border-border pl-8">
									<p className="absolute top-0 right-full w-2.5 text-micro font-semibold tracking-widest uppercase">
										<span className="absolute top-0 left-0 origin-top-left translate-x-full rotate-90 whitespace-nowrap">
											Featured
										</span>
									</p>
									{nav.featured.map((product) => (
										<Link key={product.href} href={product.href} onClick={close} className="group">
											<span className="relative block aspect-square overflow-hidden bg-muted">
												{product.image && (
													<YNSMedia src={product.image} alt="" fill sizes="320px" className="object-cover" />
												)}
											</span>
											<span className="mt-1 block text-center text-micro font-semibold transition-opacity group-hover:opacity-40">
												{product.label}
											</span>
										</Link>
									))}
								</div>
							)}
						</div>
					</div>
				</>
			)}
		</>
	);
}

/** Hamburger + the left drawer: big primary links, smaller secondary ones. */
export function MobileMenu({ nav, accountHref }: { nav: NavData; accountHref: string }) {
	const [open, setOpen] = useState(false);
	const [shopOpen, setShopOpen] = useState(false);
	const [infoOpen, setInfoOpen] = useState(false);
	const close = () => setOpen(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				aria-label="Open menu"
				className="flex h-full w-[60px] cursor-pointer items-center justify-center md:hidden"
			>
				<span aria-hidden className="flex w-[30px] flex-col gap-[6px]">
					<span className="block border-t border-current" />
					<span className="block border-t border-current" />
					<span className="block border-t border-current" />
				</span>
			</SheetTrigger>
			<SheetContent
				side="left"
				showCloseButton={false}
				className="block overflow-y-auto border-r border-border p-0 shadow-none data-[side=left]:w-full data-[side=left]:max-w-[420px] data-[side=left]:sm:max-w-[420px]"
			>
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<SheetClose
					aria-label="Close menu"
					className="absolute top-3 left-1 flex size-12 cursor-pointer items-center justify-center"
				>
					<svg aria-hidden viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor">
						<path d="M2 2l20 20M22 2L2 22" strokeWidth="1.25" />
					</svg>
				</SheetClose>
				<div className="px-4 pt-[4.5rem] pb-8">
					<ul className="flex flex-col">
						<li>
							<button
								type="button"
								aria-expanded={shopOpen}
								onClick={() => setShopOpen((v) => !v)}
								className="hull-indicator cursor-pointer text-h2 leading-[1.5]"
							>
								Shop
							</button>
							{shopOpen && (
								<ul className="mb-2 ml-2 border-l border-border pl-4">
									{nav.shop.map((link) => (
										<li key={link.href}>
											<Link href={link.href} onClick={close} className="block text-h5 leading-[1.6]">
												{link.label}
											</Link>
										</li>
									))}
								</ul>
							)}
						</li>
						<li>
							<button
								type="button"
								aria-expanded={infoOpen}
								onClick={() => setInfoOpen((v) => !v)}
								className="hull-indicator cursor-pointer text-h2 leading-[1.5]"
							>
								Info
							</button>
							{infoOpen && (
								<ul className="mb-2 ml-2 border-l border-border pl-4">
									{nav.info.map((link) => (
										<li key={link.href}>
											<Link href={link.href} onClick={close} className="block text-h5 leading-[1.6]">
												{link.label}
											</Link>
										</li>
									))}
								</ul>
							)}
						</li>
					</ul>

					<ul className="flex flex-col pt-8">
						<li>
							<a href={accountHref} className="block text-h5 leading-[1.5]">
								Account
							</a>
						</li>
						{nav.legal.map((link) => (
							<li key={link.href}>
								<Link href={link.href} onClick={close} className="block text-h5 leading-[1.5]">
									{link.label}
								</Link>
							</li>
						))}
					</ul>

					<div className={cn("mt-10 border-t border-border pt-6")}>
						<MobileSearchInput onNavigate={close} />
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
