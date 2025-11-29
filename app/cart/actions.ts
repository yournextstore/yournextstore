"use server";

import { cookies } from "next/headers";
import { ynsClient } from "../../src/yns-client";

export async function getCart() {
	const cookieStore = await cookies();
	const cartId = cookieStore.get("cartId")?.value;

	if (!cartId) {
		return null;
	}

	try {
		return await ynsClient.cartGet({ cartId });
	} catch {
		return null;
	}
}

export async function addToCart(variantId: string, quantity = 1) {
	const cookieStore = await cookies();
	const cartId = cookieStore.get("cartId")?.value;

	const cart = await ynsClient.cartUpsert({
		cartId,
		variantId,
		quantity,
	});

	if (!cart) {
		return { success: false, cart: null };
	}

	cookieStore.set("cartId", cart.id, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 60 * 60 * 24 * 30, // 30 days
	});

	// Fetch full cart data to sync with client
	const fullCart = await ynsClient.cartGet({ cartId: cart.id });

	return { success: true, cart: fullCart };
}

export async function removeFromCart(variantId: string) {
	const cookieStore = await cookies();
	const cartId = cookieStore.get("cartId")?.value;

	if (!cartId) {
		return { success: false, cart: null };
	}

	try {
		// Set quantity to 0 to remove the item
		await ynsClient.cartUpsert({
			cartId,
			variantId,
			quantity: 0,
		});

		// Fetch updated cart
		const cart = await ynsClient.cartGet({ cartId });
		return { success: true, cart };
	} catch {
		return { success: false, cart: null };
	}
}

// Set absolute quantity for a cart item
// Calculates delta internally since cartUpsert uses delta behavior
export async function setCartQuantity(variantId: string, quantity: number) {
	const cookieStore = await cookies();
	const cartId = cookieStore.get("cartId")?.value;

	if (!cartId) {
		return { success: false, cart: null };
	}

	try {
		// Get current cart to calculate delta
		const currentCart = await ynsClient.cartGet({ cartId });
		const currentItem = currentCart?.lineItems.find((item) => item.productVariant.id === variantId);
		const currentQuantity = currentItem?.quantity ?? 0;

		if (quantity <= 0) {
			// Remove item by setting quantity to 0
			await ynsClient.cartUpsert({ cartId, variantId, quantity: 0 });
		} else {
			// Calculate delta for cartUpsert
			const delta = quantity - currentQuantity;
			if (delta !== 0) {
				await ynsClient.cartUpsert({ cartId, variantId, quantity: delta });
			}
		}

		// Fetch updated cart
		const cart = await ynsClient.cartGet({ cartId });
		return { success: true, cart };
	} catch {
		return { success: false, cart: null };
	}
}
