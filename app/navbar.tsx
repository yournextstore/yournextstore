"use client";

import { ChevronLeftIcon, ChevronRightIcon, MenuIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { pill } from "@/components/munch/styles";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import type { NavCategory, ShowcaseTile } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export type NavLink = { href: string; label: string };

export type NavData = {
	/** Top-row links after "Shop all" (collections, About, Blog). */
	links: NavLink[];
	categories: NavCategory[];
	collections: NavLink[];
	/** Collections with a picture, shown as cards in the Shop all panel. */
	cards: ShowcaseTile[];
	accountHref: string;
};

/** Fades the header's 1.5px tomato rule in once the page has scrolled. Renders nothing. */
export function HeaderScrollRule() {
	useEffect(() => {
		const header = document.querySelector<HTMLElement>(".site-header");
		if (!header) return;
		const update = () => {
			header.dataset.scrolled = window.scrollY > 0 ? "true" : "false";
		};
		update();
		window.addEventListener("scroll", update, { passive: true });
		return () => window.removeEventListener("scroll", update);
	}, []);
	return null;
}

/** The blush announcement strip with its close cross. */
export function AnnouncementBar({ text }: { text: string }) {
	const [visible, setVisible] = useState(true);
	if (!visible) return null;
	return (
		<div className="w-full bg-blush">
			<div className="shell flex items-center justify-between gap-4 py-[7.5px]">
				<p className="text-b-xs leading-[1.5] lg:text-b-sm">{text}</p>
				<button
					type="button"
					aria-label="Close announcement"
					onClick={() => setVisible(false)}
					className="-m-1.5 inline-flex size-6 shrink-0 items-center justify-center"
				>
					<XIcon aria-hidden="true" className="size-3.5" strokeWidth={2} />
				</button>
			</div>
		</div>
	);
}

const topLink = "whitespace-nowrap px-5 py-[14.5px] text-b-lg leading-[1.5] transition-opacity duration-300";

/**
 * Desktop navigation: "Shop all" opens the original's full-width panel (link columns on the left,
 * picture cards on the right); siblings dim while one item is hovered.
 */
export function DesktopNav({ data }: { data: NavData }) {
	const [open, setOpen] = useState(false);
	const [hovered, setHovered] = useState<string | null>(null);
	// A hover-open is followed by the click's own event: remember it so that click keeps the panel open.
	const openedByHover = useRef(false);
	const rootRef = useRef<HTMLDivElement>(null);

	// Leaving the nav and its panel closes it (a listener: biome rejects pointer handlers on a div).
	useEffect(() => {
		const root = rootRef.current;
		if (!root) return;
		const onLeave = () => setOpen(false);
		root.addEventListener("mouseleave", onLeave);
		return () => root.removeEventListener("mouseleave", onLeave);
	}, []);

	useEffect(() => {
		if (!open) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") setOpen(false);
		};
		const onPointer = (event: PointerEvent) => {
			if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
		};
		document.addEventListener("keydown", onKey);
		document.addEventListener("pointerdown", onPointer);
		return () => {
			document.removeEventListener("keydown", onKey);
			document.removeEventListener("pointerdown", onPointer);
		};
	}, [open]);

	const dim = (key: string) => (open && key !== "shop") || (hovered !== null && hovered !== key);
	const close = () => setOpen(false);

	return (
		<div ref={rootRef} className="hidden self-stretch lg:flex">
			<nav aria-label="Main" className="flex items-center">
				<button
					type="button"
					aria-expanded={open}
					aria-controls="shop-panel"
					onMouseEnter={() => {
						setHovered("shop");
						if (!open) openedByHover.current = true;
						setOpen(true);
					}}
					onMouseLeave={() => setHovered(null)}
					onClick={() => {
						if (openedByHover.current) {
							openedByHover.current = false;
							setOpen(true);
							return;
						}
						setOpen((value) => !value);
					}}
					className={cn(topLink, dim("shop") && "opacity-50")}
				>
					Shop all
				</button>
				{data.links.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						onMouseEnter={() => {
							setHovered(link.href);
							setOpen(false);
						}}
						onMouseLeave={() => setHovered(null)}
						className={cn(topLink, dim(link.href) && "opacity-50")}
					>
						{link.label}
					</Link>
				))}
			</nav>
			<div
				id="shop-panel"
				className={cn(
					"absolute inset-x-0 top-full z-30 overflow-hidden border-b-[1.5px] border-brand bg-background transition-[opacity,transform] duration-300",
					open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-3 opacity-0",
				)}
			>
				<div className="shell flex items-start justify-between gap-xl py-2xl">
					<div className="flex flex-wrap items-start gap-lg">
						<NavColumn title="Categories">
							<PanelLink href="/products" onClick={close}>
								Everything
							</PanelLink>
							{data.categories.map((category) => (
								<PanelLink key={category.id} href={category.href} onClick={close}>
									{category.name}
								</PanelLink>
							))}
						</NavColumn>
						{data.collections.length > 0 && (
							<NavColumn title="Collections">
								{data.collections.map((collection) => (
									<PanelLink key={collection.href} href={collection.href} onClick={close}>
										{collection.label}
									</PanelLink>
								))}
							</NavColumn>
						)}
					</div>
					<div className="flex items-stretch gap-lg">
						{data.cards.slice(0, 3).map((card, index) => (
							<div
								key={card.id}
								className={cn(
									"group relative flex w-55 shrink-0 flex-col items-center gap-xs rounded-lg",
									index === 2 && "hidden xl:flex",
								)}
							>
								<div className="relative aspect-square w-55 overflow-hidden rounded-lg">
									<Image src={card.image} alt="" fill sizes="220px" className="object-cover" />
								</div>
								<span className="text-center font-serif text-d-xs leading-[1.2] tracking-[-0.48px] text-brand">
									{card.name}
								</span>
								<Link
									href={card.href}
									onClick={close}
									className="mt-xs rounded-lg border border-brand px-4 py-2 text-center text-b-sm transition-colors after:absolute after:inset-0 hover:bg-brand hover:text-paper"
								>
									Shop now
								</Link>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

function NavColumn({ title, children }: { title: string; children: ReactNode }) {
	return (
		<div className="group/col flex min-w-56 xl:min-w-67.5 flex-col items-start">
			<p className="pb-s text-b-md leading-[1.5]">{title}</p>
			{children}
		</div>
	);
}

function PanelLink({ href, onClick, children }: { href: string; onClick: () => void; children: ReactNode }) {
	return (
		<Link
			href={href}
			onClick={onClick}
			className="py-xs text-b-lg leading-[1.1] tracking-[0.36px] transition-opacity duration-300 group-hover/col:opacity-50 hover:opacity-100!"
		>
			{children}
		</Link>
	);
}

/**
 * Phone/tablet menu: a full-screen cream sheet whose first row repeats the header (the cross sits
 * where the burger was), big sans links, and "Shop all" sliding in its own sub-panel.
 */
export function MobileMenu({ data, brand }: { data: NavData; brand: ReactNode }) {
	const [open, setOpen] = useState(false);
	const [sub, setSub] = useState(false);
	const close = () => setOpen(false);

	const item = "flex w-full items-center justify-between p-m text-b-2xl leading-[1.5]";

	return (
		<Sheet
			open={open}
			onOpenChange={(value) => {
				setOpen(value);
				if (value) setSub(false);
			}}
		>
			<button
				type="button"
				aria-label="Open menu"
				onClick={() => setOpen(true)}
				className="-ml-2 inline-flex size-10 shrink-0 items-center justify-center lg:hidden"
			>
				<MenuIcon aria-hidden="true" className="size-6" strokeWidth={1.75} />
			</button>
			<SheetContent
				side="left"
				hideClose
				overlayClassName="bg-transparent"
				className="w-full max-w-none gap-0 overflow-hidden border-none p-0 shadow-none sm:max-w-none"
			>
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<SheetDescription className="sr-only">Site navigation</SheetDescription>
				<div className="flex h-[60px] shrink-0 items-center gap-s px-m">
					<SheetClose
						aria-label="Close menu"
						className="-ml-2 inline-flex size-10 shrink-0 items-center justify-center"
					>
						<XIcon aria-hidden="true" className="size-6" strokeWidth={1.75} />
					</SheetClose>
					<Link href="/" onClick={close} className="min-w-0">
						{brand}
					</Link>
				</div>
				<div className="relative flex-1 overflow-hidden">
					<div
						className={cn(
							"no-scrollbar absolute inset-0 flex flex-col overflow-y-auto transition-transform duration-300",
							sub ? "-translate-x-full" : "translate-x-0",
						)}
						inert={sub}
					>
						<button type="button" className={item} onClick={() => setSub(true)}>
							Shop all
							<ChevronRightIcon aria-hidden="true" className="size-8" strokeWidth={1.25} />
						</button>
						{data.links.map((link) => (
							<Link key={link.href} href={link.href} onClick={close} className={item}>
								{link.label}
							</Link>
						))}
						<a href={data.accountHref} className={item}>
							Account
						</a>
						<div className="px-m pt-s pb-xl">
							<MobileSearchInput onNavigate={close} />
						</div>
					</div>
					<div
						className={cn(
							"no-scrollbar absolute inset-0 flex flex-col overflow-y-auto pb-lg transition-transform duration-300",
							sub ? "translate-x-0" : "translate-x-full",
						)}
						inert={!sub}
					>
						<button type="button" className="flex items-center gap-s p-m" onClick={() => setSub(false)}>
							<ChevronLeftIcon aria-hidden="true" className="size-8" strokeWidth={1.25} />
							<span className="text-b-2xl leading-[1.5]">Shop all</span>
						</button>
						<div className="flex flex-col gap-xl">
							<div className="flex flex-col items-start gap-s px-m">
								<p className="text-b-md leading-[1.5]">Categories</p>
								<Link href="/products" onClick={close} className="py-1 text-b-2xl leading-[1.1]">
									Everything
								</Link>
								{data.categories.map((category) => (
									<Link
										key={category.id}
										href={category.href}
										onClick={close}
										className="py-1 text-b-2xl leading-[1.1]"
									>
										{category.name}
									</Link>
								))}
							</div>
							{data.cards.length > 0 && (
								<div className="no-scrollbar flex w-full gap-xs overflow-x-auto px-m">
									{data.cards.map((card) => (
										<div key={card.id} className="flex w-55 shrink-0 flex-col items-center gap-xs">
											<div className="relative aspect-square w-full overflow-hidden rounded-lg">
												<Image src={card.image} alt="" fill sizes="220px" className="object-cover" />
											</div>
											<span className="text-center font-serif text-d-xs leading-[1.2] text-brand">
												{card.name}
											</span>
											<Link
												href={card.href}
												onClick={close}
												className={pill({ size: "sm", variant: "outline-ink", className: "mt-xs" })}
											>
												Shop now
											</Link>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
