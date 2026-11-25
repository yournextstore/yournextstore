"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useCart } from "@/app/cart/cart-context";

const loadCartSidebar = () => import("@/app/cart/cart-sidebar");

const CartSidebar = dynamic(() => loadCartSidebar().then((module) => module.CartSidebar), { ssr: false });

/**
 * The cart sheet is not part of the first paint: its code loads once the browser is idle, so the first open is still
 * instant, and the sheet mounts on that first open.
 */
export function CartSidebarLoader() {
	const { isOpen } = useCart();
	const [opened, setOpened] = useState(isOpen);
	if (isOpen && !opened) {
		setOpened(true);
	}

	useEffect(() => {
		if (typeof window.requestIdleCallback !== "function") {
			const timer = setTimeout(loadCartSidebar, 2000);
			return () => clearTimeout(timer);
		}
		const handle = window.requestIdleCallback(() => void loadCartSidebar());
		return () => window.cancelIdleCallback(handle);
	}, []);

	return opened ? <CartSidebar /> : null;
}
