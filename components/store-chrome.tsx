"use client";

import { Home, LayoutGrid, Search, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/app/cart/cart-context";
import { OPEN_MENU_EVENT } from "@/app/navbar";

const DISMISSED = "store-announcement-dismissed";

/** The original's forest-green announcement strip, dismissible for the session. */
export function Announcement({ text, href }: { text: string; href: string | null }) {
	const [hidden, setHidden] = useState(false);
	useEffect(() => {
		try {
			if (sessionStorage.getItem(DISMISSED)) setHidden(true);
		} catch {}
	}, []);
	if (hidden) return null;
	return (
		<div className="announcement">
			<div className="announcement-text">{href ? <Link href={href}>{text}</Link> : text}</div>
			<button
				type="button"
				className="announcement-close"
				aria-label="Dismiss announcement"
				onClick={() => {
					setHidden(true);
					try {
						sessionStorage.setItem(DISMISSED, "1");
					} catch {}
				}}
			>
				<X size={14} aria-hidden />
			</button>
		</div>
	);
}

/**
 * Phones only (CSS): the original's floating glass tab bar. Shop opens the menu sheet, Bag the
 * cart drawer. It tucks away on product pages, which dock their own buy bar.
 */
export function TabBar() {
	const { itemCount, openCart } = useCart();
	return (
		<nav className="tab-bar" aria-label="Quick navigation">
			<Link href="/" className="tab">
				<span className="tab-icon">
					<Home size={21} strokeWidth={1.7} aria-hidden />
				</span>
				<span className="tab-label">Home</span>
			</Link>
			<button type="button" className="tab" onClick={() => window.dispatchEvent(new Event(OPEN_MENU_EVENT))}>
				<span className="tab-icon">
					<LayoutGrid size={21} strokeWidth={1.7} aria-hidden />
				</span>
				<span className="tab-label">Shop</span>
			</button>
			<Link href="/search" className="tab">
				<span className="tab-icon">
					<Search size={21} strokeWidth={1.7} aria-hidden />
				</span>
				<span className="tab-label">Search</span>
			</Link>
			<button type="button" className="tab" onClick={openCart} aria-label={`Bag, ${itemCount} items`}>
				<span className="tab-icon">
					<ShoppingBag size={21} strokeWidth={1.7} aria-hidden />
					<span className="count" hidden={itemCount === 0}>
						{itemCount}
					</span>
				</span>
				<span className="tab-label" aria-hidden>
					Bag
				</span>
			</button>
		</nav>
	);
}
