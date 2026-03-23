"use client";

import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useMemo, useOptimistic, useState } from "react";

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
};

export type Cart = {
	id: string;
	lineItems: CartLineItem[];
};

/** Get the effective unit price for a line item, computing bundle price from constituents if needed. */
export function getLineItemUnitPrice(item: CartLineItem): bigint {
	const { product } = item.productVariant;
	if (product.type === "bundle" && product.bundleProducts && product.bundleProducts.length > 0) {
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

type CartContextValue = {
	cart: Cart | null;
	items: CartLineItem[];
	itemCount: number;
	subtotal: bigint;
	isOpen: boolean;
	cartId: string | null;
	openCart: () => void;
	closeCart: () => void;
	dispatch: (action: CartAction) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

type CartProviderProps = {
	children: ReactNode;
	initialCart: Cart | null;
	initialCartId: string | null;
};

export function CartProvider({ children, initialCart, initialCartId }: CartProviderProps) {
	const [isOpen, setIsOpen] = useState(false);

	const [optimisticCart, dispatchCartAction] = useOptimistic(initialCart, (state, action: CartAction) => {
		if (!state) {
			// Handle ADD_ITEM when cart is null
			if (action.type === "ADD_ITEM") {
				return {
					id: "optimistic",
					lineItems: [action.item],
				};
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
	});

	const items = useMemo(() => optimisticCart?.lineItems ?? [], [optimisticCart]);

	const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

	const subtotal = useMemo(
		() => items.reduce((sum, item) => sum + getLineItemUnitPrice(item) * BigInt(item.quantity), BigInt(0)),
		[items],
	);

	const openCart = useCallback(() => setIsOpen(true), []);
	const closeCart = useCallback(() => setIsOpen(false), []);

	// Derive cartId from optimistic cart or initial
	const currentCartId =
		optimisticCart?.id && optimisticCart.id !== "optimistic" ? optimisticCart.id : initialCartId;

	const value = useMemo(
		() => ({
			cart: optimisticCart,
			items,
			itemCount,
			subtotal,
			isOpen,
			cartId: currentCartId,
			openCart,
			closeCart,
			dispatch: dispatchCartAction,
		}),
		[
			optimisticCart,
			items,
			itemCount,
			subtotal,
			isOpen,
			currentCartId,
			openCart,
			closeCart,
			dispatchCartAction,
		],
	);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
}
