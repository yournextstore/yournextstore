"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/app/cart/cart-context";
import { CartIcon, GridIcon, HomeIcon, ProfileIcon } from "@/components/gf/icons";
import { cn } from "@/lib/utils";

const tab =
	"flex h-12 w-full items-center justify-center rounded-full transition-colors hover:bg-flash-white focus-visible:outline-2 focus-visible:outline-green-500";

// The active tab follows the route. Read from `location` (not usePathname, which would pull
// the tab bar out of the prerendered shell) and refreshed on every client navigation.
function useCurrentPath() {
	const [path, setPath] = useState<string | null>(null);
	useEffect(() => {
		const update = () => setPath(window.location.pathname);
		update();
		const nav = (window as unknown as { navigation?: EventTarget }).navigation;
		nav?.addEventListener("navigatesuccess", update);
		window.addEventListener("popstate", update);
		return () => {
			nav?.removeEventListener("navigatesuccess", update);
			window.removeEventListener("popstate", update);
		};
	}, []);
	return path;
}

export function BottomNav({ accountHref }: { accountHref: string }) {
	const { openCart, isOpen } = useCart();
	const path = useCurrentPath();
	const isHome = path === "/";
	const isCategories = path === "/categories" || path?.startsWith("/category/");

	return (
		<nav
			aria-label="Tab bar"
			className="flex items-center gap-[15px] rounded-[50px] bg-white px-5 pt-4 pb-6 gf-shadow"
		>
			<Link
				href="/"
				aria-label="Home"
				aria-current={isHome ? "page" : undefined}
				className={cn(tab, isHome && "text-green-500")}
			>
				<HomeIcon />
			</Link>
			<Link
				href="/categories"
				aria-label="Categories"
				aria-current={isCategories ? "page" : undefined}
				className={cn(tab, isCategories && "text-green-500")}
			>
				<GridIcon />
			</Link>
			<button
				type="button"
				aria-label="Cart"
				onClick={openCart}
				className={cn(tab, isOpen && "text-green-500")}
			>
				<CartIcon />
			</button>
			{/* Plain <a>: /account is a proxied zone (AGENTS.md). */}
			<a href={accountHref} aria-label="Account" className={tab}>
				<ProfileIcon />
			</a>
		</nav>
	);
}
