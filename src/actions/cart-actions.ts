"use server";

import type { Cart } from "commerce-kit";
import { clearCartId, getCartId, setCartId } from "@/lib/cart-cookies";
import { commerce } from "@/lib/commerce";

export async function getCartAction(): Promise<Cart | null> {
	const cartId = await getCartId();
	if (!cartId) return null;

	try {
		const cart = await commerce.cart.get({ cartId });
		return cart;
	} catch (error) {
		console.error("Error fetching cart:", error);
		return null;
	}
}

export async function addToCartAction(variantId: string, quantity = 1): Promise<Cart | null> {
	try {
		let cartId = await getCartId();

		const cart = await commerce.cart.add({
			cartId: cartId || undefined,
			variantId,
			quantity,
		});

		// Store cart ID if this was the first item
		if (!cartId && cart.id) {
			await setCartId(cart.id);
		}

		return cart;
	} catch (error) {
		console.error("Error adding to cart:", error);
		throw error;
	}
}

export async function updateCartItemAction(variantId: string, quantity: number): Promise<Cart | null> {
	const cartId = await getCartId();
	if (!cartId) return null;

	try {
		const cart = await commerce.cart.update({
			cartId,
			variantId,
			quantity,
		});
		return cart;
	} catch (error) {
		console.error("Error updating cart item:", error);
		throw error;
	}
}

export async function removeFromCartAction(variantId: string): Promise<Cart | null> {
	const cartId = await getCartId();
	if (!cartId) return null;

	try {
		const cart = await commerce.cart.remove({
			cartId,
			variantId,
		});
		return cart;
	} catch (error) {
		console.error("Error removing from cart:", error);
		throw error;
	}
}

export async function clearCartAction(): Promise<void> {
	const cartId = await getCartId();
	if (!cartId) return;

	try {
		await commerce.cart.clear({ cartId });
		await clearCartId();
	} catch (error) {
		console.error("Error clearing cart:", error);
		throw error;
	}
}

export async function getCartItemCount(): Promise<number> {
	const cart = await getCartAction();
	return cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
}
