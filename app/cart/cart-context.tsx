"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useRef, useState, useTransition } from "react";
import { getCart } from "@/app/cart/actions";
import {
	type Cart,
	type CartAction,
	type CartLineItem,
	cartReducer,
	getCartDisplaySubtotal,
	getLineItemUnitPrice,
} from "@/app/cart/cart-math";
import { useStoreConfig } from "@/components/store-config-provider";

// Re-exported so consumers keep importing cart types and pricing from the context module.
export { type Cart, type CartLineItem, getLineItemUnitPrice };

type CartContextValue = {
	cart: Cart | null;
	items: CartLineItem[];
	itemCount: number;
	subtotal: bigint;
	isOpen: boolean;
	isMutating: boolean;
	cartId: string | null;
	openCart: () => void;
	closeCart: () => void;
	/** Instant local mutation for optimistic feedback. */
	dispatch: (action: CartAction) => void;
	/** Replace local state with the server's authoritative cart (no-op on null). */
	syncCart: (next: Cart | null) => void;
	/** Refetch the authoritative cart from the server — call only when a write FAILED. */
	reconcile: () => Promise<void>;
	startMutation: (fn: () => void | Promise<void>) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

type CartProviderProps = {
	children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
	const { taxBehavior } = useStoreConfig();
	const [isOpen, setIsOpen] = useState(false);
	const [isMutating, startMutation] = useTransition();

	// PLAIN state — no useOptimistic. `dispatch` applies the local mutation for instant
	// feedback; `syncCart` replaces it with the server's authoritative cart. Because state
	// never rebases, the local mutation can't be double-applied on top of the synced cart.
	//
	// Starts EMPTY and loads in the browser (the effect below): the cart is a cookie read,
	// and reading it on the server would render every page per request instead of serving
	// the static prerender.
	const [cart, setCart] = useState<Cart | null>(null);
	// Set by every write. Guards against the initial cart load landing on top of a
	// mutation the customer made before it arrived.
	const written = useRef(false);

	// No useCallback/useMemo in this provider: the React Compiler memoizes the callbacks,
	// the derived values and the context value.
	const dispatch = (action: CartAction) => {
		written.current = true;
		setCart((prev) => cartReducer(prev, action));
	};
	const syncCart = (next: Cart | null) => {
		if (next) {
			written.current = true;
			setCart(next);
		}
	};
	const reconcile = async () => {
		written.current = true;
		setCart((await getCart()) as Cart | null);
	};

	useEffect(() => {
		// One read per full page load; soft navigations keep this provider mounted. A write
		// that lands first wins, and a failed load leaves the cart empty, never an unhandled
		// rejection.
		void getCart()
			.then((initial) => {
				if (!written.current) {
					setCart(initial as Cart | null);
				}
			})
			.catch(() => undefined);
	}, []);

	useEffect(() => {
		// Re-fetch the cart when restored from bfcache — it can change on the hosted
		// checkout (different origin) and would otherwise show stale items.
		// The refetch lives in here, not in `reconcile`, so the effect depends on nothing.
		const onPageShow = (event: PageTransitionEvent) => {
			if (event.persisted) {
				written.current = true;
				// Keep showing the current cart if the refetch fails — never an unhandled rejection.
				void getCart()
					.then((next) => setCart(next as Cart | null))
					.catch(() => undefined);
			}
		};
		window.addEventListener("pageshow", onPageShow);
		return () => window.removeEventListener("pageshow", onPageShow);
	}, []);

	const items = cart?.lineItems ?? [];
	const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

	// The API's own subtotal when the cart is the server's (already net or gross per the
	// store's tax behaviour, discounts applied); a local sum of display prices while a
	// mutation is in flight, because `cartReducer` clears the totals it just invalidated.
	const subtotal = getCartDisplaySubtotal(cart, taxBehavior);

	// The sentinel "local" id marks a null-base ADD the server hasn't answered yet.
	const cartId = cart?.id && cart.id !== "local" ? cart.id : null;

	const value = {
		cart,
		items,
		itemCount,
		subtotal,
		isOpen,
		isMutating,
		cartId,
		openCart: () => setIsOpen(true),
		closeCart: () => setIsOpen(false),
		dispatch,
		syncCart,
		reconcile,
		startMutation,
	};

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
}
