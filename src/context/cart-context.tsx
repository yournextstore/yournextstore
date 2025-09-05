"use client";

import type { Cart, ProductInfo } from "commerce-kit";
import { createContext, type ReactNode, useContext, useEffect, useOptimistic, useState } from "react";
import {
	addToCartAction,
	getCartAction,
	removeFromCartAction,
	updateCartItemAction,
} from "@/actions/cart-actions";

type CartAction =
	| { type: "ADD_ITEM"; variantId: string; quantity: number; product?: ProductInfo }
	| { type: "UPDATE_ITEM"; variantId: string; quantity: number }
	| { type: "REMOVE_ITEM"; variantId: string }
	| { type: "SYNC_CART"; cart: Cart | null };

interface CartContextType {
	cart: Cart | null;
	isCartOpen: boolean;
	itemCount: number;
	openCart: () => void;
	closeCart: () => void;
	optimisticAdd: (variantId: string, quantity: number, product?: ProductInfo) => Promise<void>;
	optimisticUpdate: (variantId: string, quantity: number) => Promise<void>;
	optimisticRemove: (variantId: string) => Promise<void>;
}

function cartReducer(state: Cart | null, action: CartAction): Cart | null {
	switch (action.type) {
		case "ADD_ITEM": {
			if (!state) {
				// Create a new cart if none exists
				return {
					id: "optimistic",
					items: [
						{
							id: action.variantId,
							productId: action.variantId,
							variantId: action.variantId,
							quantity: action.quantity,
							price: 0, // Will be updated from server
							product: action.product,
						},
					],
					total: 0,
					currency: "USD",
				};
			}

			// Check if item already exists
			const existingItemIndex = state.items.findIndex(
				(item) => (item.variantId || item.productId) === action.variantId,
			);

			if (existingItemIndex >= 0) {
				// Update existing item
				const existingItem = state.items[existingItemIndex];
				if (existingItem) {
					const updatedItems = [...state.items];
					updatedItems[existingItemIndex] = {
						...existingItem,
						quantity: existingItem.quantity + action.quantity,
					};
					return {
						...state,
						items: updatedItems,
					};
				}
			}

			// Add new item
			return {
				...state,
				items: [
					...state.items,
					{
						id: action.variantId,
						productId: action.variantId,
						variantId: action.variantId,
						quantity: action.quantity,
						price: 0, // Will be updated from server
						product: action.product,
					},
				],
			};
		}

		case "UPDATE_ITEM": {
			if (!state) return state;

			if (action.quantity <= 0) {
				// Remove item if quantity is 0 or less
				return {
					...state,
					items: state.items.filter((item) => (item.variantId || item.productId) !== action.variantId),
				};
			}

			const updatedItems = state.items.map((item) => {
				if ((item.variantId || item.productId) === action.variantId) {
					return { ...item, quantity: action.quantity };
				}
				return item;
			});

			return {
				...state,
				items: updatedItems,
			};
		}

		case "REMOVE_ITEM": {
			if (!state) return state;

			return {
				...state,
				items: state.items.filter((item) => (item.variantId || item.productId) !== action.variantId),
			};
		}

		case "SYNC_CART": {
			return action.cart;
		}

		default:
			return state;
	}
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
	const [actualCart, setActualCart] = useState<Cart | null>(null);
	const [optimisticCart, setOptimisticCart] = useOptimistic(actualCart, cartReducer);
	const [isCartOpen, setIsCartOpen] = useState(false);

	// Calculate item count from optimistic cart
	const itemCount = optimisticCart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

	// Load initial cart
	useEffect(() => {
		getCartAction().then((cart) => {
			setActualCart(cart);
		});
	}, []);

	// Sync optimistic cart with actual cart when it changes
	useEffect(() => {
		setOptimisticCart({ type: "SYNC_CART", cart: actualCart });
	}, [actualCart, setOptimisticCart]);

	const openCart = () => setIsCartOpen(true);
	const closeCart = () => setIsCartOpen(false);

	const optimisticAdd = async (variantId: string, quantity = 1, product?: ProductInfo) => {
		// Optimistically update UI
		setOptimisticCart({ type: "ADD_ITEM", variantId, quantity, product });

		try {
			// Perform server action
			const updatedCart = await addToCartAction(variantId, quantity);
			setActualCart(updatedCart);
		} catch (error) {
			// Rollback will happen automatically via useEffect
			console.error("Failed to add to cart:", error);
			throw error;
		}
	};

	const optimisticUpdate = async (variantId: string, quantity: number) => {
		// Optimistically update UI
		setOptimisticCart({ type: "UPDATE_ITEM", variantId, quantity });

		try {
			// Perform server action
			const updatedCart = await updateCartItemAction(variantId, quantity);
			setActualCart(updatedCart);
		} catch (error) {
			// Rollback will happen automatically via useEffect
			console.error("Failed to update cart item:", error);
			throw error;
		}
	};

	const optimisticRemove = async (variantId: string) => {
		// Optimistically update UI
		setOptimisticCart({ type: "REMOVE_ITEM", variantId });

		try {
			// Perform server action
			const updatedCart = await removeFromCartAction(variantId);
			setActualCart(updatedCart);
		} catch (error) {
			// Rollback will happen automatically via useEffect
			console.error("Failed to remove from cart:", error);
			throw error;
		}
	};

	return (
		<CartContext.Provider
			value={{
				cart: optimisticCart,
				isCartOpen,
				itemCount,
				openCart,
				closeCart,
				optimisticAdd,
				optimisticUpdate,
				optimisticRemove,
			}}
		>
			{children}
		</CartContext.Provider>
	);
}

export function useCart() {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
}
