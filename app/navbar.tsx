"use client";

import { ChevronRight, Layers, LayoutGrid, Menu, UserRound, X } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { YNSMedia } from "@/lib/yns-media";

export type NavItem = {
	href: string;
	name: string;
	image?: string | null;
	hint?: string | null;
};

/** The tab bar's Shop tab opens the same menu sheet as the header button. */
export const OPEN_MENU_EVENT = "store:open-menu";

/**
 * Desktop category row: a grey rail whose white highlight glides to the item under the pointer
 * (or keyboard focus). Mega panels are `<details>`; they close on outside click, Escape or a link.
 * No usePathname here: the header must stay in the prerendered shell.
 */
export function DesktopNavigation({ children, aside }: { children: ReactNode; aside: ReactNode }) {
	const ref = useRef<HTMLElement>(null);
	const rail = useRef<HTMLDivElement>(null);
	const glow = useRef<HTMLSpanElement>(null);
	const closeAll = () => {
		for (const el of ref.current?.querySelectorAll("details[open]") ?? []) {
			el.removeAttribute("open");
		}
	};
	useEffect(() => {
		const close = (event: PointerEvent) => {
			if (event.target instanceof Node && !ref.current?.contains(event.target)) {
				for (const el of ref.current?.querySelectorAll("details[open]") ?? []) {
					el.removeAttribute("open");
				}
			}
		};
		document.addEventListener("pointerdown", close);
		return () => document.removeEventListener("pointerdown", close);
	}, []);
	const moveTo = (target: EventTarget | null) => {
		const item = target instanceof HTMLElement ? target.closest<HTMLElement>(".nav-link") : null;
		const layer = glow.current;
		if (!item || !layer || !rail.current?.contains(item) || !ref.current) return;
		const r = ref.current.getBoundingClientRect();
		const i = item.getBoundingClientRect();
		const clip = `inset(${i.top - r.top}px ${r.right - i.right}px ${r.bottom - i.bottom}px ${i.left - r.left}px round 999px)`;
		if (layer.dataset.hidden !== undefined) {
			// Appearing: jump to the item, then fade in. Only item-to-item moves glide.
			layer.style.transition = "none";
			layer.style.clipPath = clip;
			void layer.offsetWidth;
			layer.style.transition = "";
			delete layer.dataset.hidden;
		} else layer.style.clipPath = clip;
	};
	const hide = () => glow.current?.setAttribute("data-hidden", "");
	return (
		<nav
			ref={ref}
			aria-label="Main navigation"
			className="desktop-nav store-width"
			onClick={(event) => {
				if (event.target instanceof Element && event.target.closest("a")) closeAll();
			}}
			onKeyDown={(event) => {
				if (event.key === "Escape") closeAll();
			}}
			onBlur={(event) => {
				if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
					closeAll();
					hide();
				}
			}}
		>
			<span ref={glow} className="nav-glow" data-hidden="" aria-hidden />
			{/* biome-ignore lint/a11y/noStaticElementInteractions: pointer/focus only move the decorative glow. */}
			<div
				ref={rail}
				className="nav-rail"
				onPointerOver={(event) => moveTo(event.target)}
				onPointerLeave={hide}
				onFocus={(event) => moveTo(event.target)}
			>
				{children}
			</div>
			<div className="nav-aside">{aside}</div>
		</nav>
	);
}

/** Mobile menu: the original's admin-sidebar sheet, labelled groups of icon-tile rows. */
export function MobileMenu({
	storeName,
	shop,
	collections,
	pages,
	accountHref,
}: {
	storeName: string;
	shop: NavItem[];
	collections: NavItem[];
	pages: NavItem[];
	accountHref: string;
}) {
	const [open, setOpen] = useState(false);
	useEffect(() => {
		const openMenu = () => setOpen(true);
		window.addEventListener(OPEN_MENU_EVENT, openMenu);
		return () => window.removeEventListener(OPEN_MENU_EVENT, openMenu);
	}, []);
	const close = () => setOpen(false);
	const row = (item: NavItem, fallback: ReactNode) => (
		<Link key={item.href} href={item.href} className="menu-link" onClick={close}>
			<span className="icon-tile" aria-hidden>
				{item.image ? <YNSMedia src={item.image} alt="" width={40} height={40} sizes="40px" /> : fallback}
			</span>
			<span className="menu-link-copy">
				{item.name}
				{item.hint && <small>{item.hint}</small>}
			</span>
			<ChevronRight size={18} className="menu-link-go" aria-hidden />
		</Link>
	);
	return (
		<>
			<button
				type="button"
				className="icon-button mobile-only menu-button"
				aria-label="Open menu"
				onClick={() => setOpen(true)}
			>
				<Menu size={20} aria-hidden />
			</button>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetContent side="left" className="store-sheet menu-sheet" showCloseButton={false}>
					<div className="menu-sheet-head">
						<SheetTitle>{storeName}</SheetTitle>
						<SheetClose className="icon-button" aria-label="Close menu">
							<X size={20} aria-hidden />
						</SheetClose>
					</div>
					<SheetDescription className="sr-only">Browse the shop</SheetDescription>
					<div className="menu-search">
						<MobileSearchInput onNavigate={close} />
					</div>
					<nav className="menu-sheet-nav" aria-label="Shop">
						<p className="menu-label">Shop</p>
						{row(
							{ href: "/products", name: "All products", hint: "Everything in store" },
							<LayoutGrid size={17} aria-hidden />,
						)}
						{shop.map((item) => row(item, <Layers size={17} aria-hidden />))}
						{collections.length > 0 && <p className="menu-label">Collections</p>}
						{collections.map((item) => row(item, <Layers size={17} aria-hidden />))}
						{pages.length > 0 && <p className="menu-label">Information</p>}
						{pages.map((item) => row(item, <ChevronRight size={17} aria-hidden />))}
					</nav>
					<div className="menu-sheet-contact">
						<p>
							Your account
							<small>Orders, addresses and returns</small>
						</p>
						<div>
							{/* Plain <a>: /account is a proxied zone, a soft navigation into it 500s. */}
							<a href={accountHref} className="button primary sm">
								<UserRound size={15} aria-hidden /> Sign in
							</a>
							<Link href="/contact" className="button sm" onClick={close}>
								Contact us
							</Link>
						</div>
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
}
