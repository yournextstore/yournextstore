"use client";

import type { ReactNode } from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
	useTransition,
} from "react";
import { getCart } from "@/app/cart/actions";

export type CartLineItem = {
	quantity: number;
	productVariant: {
		id: string;
		price: string;
		images: string[];
		product: {
			id: string;
			name: string;
			slug: string;
			images: string[];
			type?: string;
			bundleDiscountPercentage?: string | null;
			bundleProducts?: Array<{
				quantity: number;
				variant: { price: string };
			}>;
		};
	};
	// Present (non-empty) on configurable-bundle lines: the customer's chosen components.
	// Its presence is how we tell a configurable bundle from a legacy fixed one.
	setSelections?: Array<{ quantity: number }>;
};

export type Cart = {
	id: string;
	lineItems: CartLineItem[];
};

/** Get the effective unit price for a line item, computing bundle price from constituents if needed. */
export function getLineItemUnitPrice(item: CartLineItem): bigint {
	const { product } = item.productVariant;
	// Configurable bundles are priced server-side from the customer's selections; the per-unit price
	// is already on productVariant.price. Only the legacy fixed-bundle shape (no selections) needs
	// client-side reconstruction from its constituents.
	const isConfigurable = (item.setSelections?.length ?? 0) > 0;
	if (
		!isConfigurable &&
		product.type === "bundle" &&
		product.bundleProducts &&
		product.bundleProducts.length > 0
	) {
		let total = 0n;
		for (const bp of product.bundleProducts) {
			let net = BigInt(bp.variant.price);
			if (product.bundleDiscountPercentage) {
				const discount = (net * BigInt(product.bundleDiscountPercentage)) / 100_000n;
				net = net - discount;
			}
			total += net * BigInt(bp.quantity);
		}
		return total;
	}
	return BigInt(item.productVariant.price);
}

type CartAction =
	| { type: "INCREASE"; variantId: string }
	| { type: "DECREASE"; variantId: string }
	| { type: "REMOVE"; variantId: string }
	| { type: "ADD_ITEM"; item: CartLineItem };

// Pure reducer for INSTANT local feedback only. After every mutation the caller
// REPLACES this with the server-returned cart (syncCart) — plain state, no rebase,
// so a local mutation can never be re-applied on top of the authoritative cart.
function cartReducer(state: Cart | null, action: CartAction): Cart | null {
	if (!state) {
		if (action.type === "ADD_ITEM") {
			return { id: "local", lineItems: [action.item] };
		}
		return state;
	}

	switch (action.type) {
		case "INCREASE":
			return {
				...state,
				lineItems: state.lineItems.map((item) =>
					item.productVariant.id === action.variantId ? { ...item, quantity: item.quantity + 1 } : item,
				),
			};

		case "DECREASE":
			return {
				...state,
				lineItems: state.lineItems
					.map((item) => {
						if (item.productVariant.id === action.variantId) {
							if (item.quantity - 1 <= 0) {
								return null;
							}
							return { ...item, quantity: item.quantity - 1 };
						}
						return item;
					})
					.filter((item): item is CartLineItem => item !== null),
			};

		case "REMOVE":
			return {
				...state,
				lineItems: state.lineItems.filter((item) => item.productVariant.id !== action.variantId),
			};

		case "ADD_ITEM": {
			const existingItem = state.lineItems.find(
				(item) => item.productVariant.id === action.item.productVariant.id,
			);

			if (existingItem) {
				return {
					...state,
					lineItems: state.lineItems.map((item) =>
						item.productVariant.id === action.item.productVariant.id
							? { ...item, quantity: item.quantity + action.item.quantity }
							: item,
					),
				};
			}

			return {
				...state,
				lineItems: [...state.lineItems, action.item],
			};
		}

		default:
			return state;
	}
}

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
	/** Seed the cart read from the customer's cookie once it streams in. See CartBootstrap. */
	bootstrap: (next: Cart | null, nextId: string | null) => void;
	startMutation: (fn: () => void | Promise<void>) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

type CartProviderProps = {
	children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isMutating, startMutation] = useTransition();

	// PLAIN state — no useOptimistic. `dispatch` applies the local mutation for instant
	// feedback; `syncCart` replaces it with the server's authoritative cart. Because state
	// never rebases, the local mutation can't be double-applied on top of the synced cart.
	//
	// Starts EMPTY: the cart is a cookie read, so it arrives after the prerendered shell
	// (via CartBootstrap) rather than as a prop. Taking it as a prop would make every
	// component above this one dynamic — including the header and footer.
	const [cart, setCart] = useState<Cart | null>(null);
	const [serverCartId, setServerCartId] = useState<string | null>(null);
	// Set by every write. Guards against the streamed-in cookie cart landing on top of a
	// mutation the customer made before it arrived.
	const written = useRef(false);

	const dispatch = useCallback((action: CartAction) => {
		written.current = true;
		setCart((prev) => cartReducer(prev, action));
	}, []);
	const syncCart = useCallback((next: Cart | null) => {
		if (next) {
			written.current = true;
			setCart(next);
		}
	}, []);
	const reconcile = useCallback(async () => {
		written.current = true;
		setCart((await getCart()) as Cart | null);
	}, []);
	const bootstrap = useCallback((next: Cart | null, nextId: string | null) => {
		if (written.current) {
			return;
		}
		setCart(next);
		setServerCartId(nextId);
	}, []);

	useEffect(() => {
		// Re-fetch the cart when restored from bfcache — it can change on the hosted
		// checkout (different origin) and would otherwise show stale items. Pull the
		// authoritative cart directly instead of router.refresh() (which would re-run
		// the layout's read-replica cartGet and can rebase onto a stale read).
		const onPageShow = (event: PageTransitionEvent) => {
			if (event.persisted) {
				// Keep showing the current cart if the refetch fails — never an unhandled rejection.
				void reconcile().catch(() => undefined);
			}
		};
		window.addEventListener("pageshow", onPageShow);
		return () => window.removeEventListener("pageshow", onPageShow);
	}, [reconcile]);

	const items = useMemo(() => cart?.lineItems ?? [], [cart]);

	const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

	const subtotal = useMemo(
		() => items.reduce((sum, item) => sum + getLineItemUnitPrice(item) * BigInt(item.quantity), BigInt(0)),
		[items],
	);

	const openCart = useCallback(() => setIsOpen(true), []);
	const closeCart = useCallback(() => setIsOpen(false), []);

	// The sentinel "local" id is only used for a null-base ADD; fall back to the server cart id.
	const currentCartId = cart?.id && cart.id !== "local" ? cart.id : serverCartId;

	const value = useMemo(
		() => ({
			cart,
			items,
			itemCount,
			subtotal,
			isOpen,
			isMutating,
			cartId: currentCartId,
			openCart,
			closeCart,
			dispatch,
			syncCart,
			reconcile,
			bootstrap,
			startMutation,
		}),
		[
			cart,
			items,
			itemCount,
			subtotal,
			isOpen,
			isMutating,
			currentCartId,
			openCart,
			closeCart,
			dispatch,
			syncCart,
			reconcile,
			bootstrap,
		],
	);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Hands the cookie-read cart to the provider once it streams in.
 *
 * Renders nothing. It exists so the read of the cart cookie can live in its own
 * Suspense boundary BELOW the header and footer: under `cacheComponents` any await
 * on a request-time API poisons everything above it, and a layout that awaits the
 * cart before rendering its chrome prerenders to an empty shell — a blank white
 * page until the server responds. Keep this the only cart read in the layout.
 */
export function CartBootstrap({ cart, cartId }: { cart: Cart | null; cartId: string | null }) {
	const { bootstrap } = useCart();

	useEffect(() => {
		bootstrap(cart, cartId);
	}, [bootstrap, cart, cartId]);

	return null;
}

export function useCart() {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
}
