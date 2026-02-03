"use server";

import { cookies } from "next/headers";
import { commerce } from "@/lib/commerce";

export async function getCart() {
	const cookieStore = await cookies();
	const cartId = cookieStore.get("cartId")?.value;

	if (!cartId) {
		return null;
	}

	try {
		return await commerce.cartGet({ cartId });
	} catch {
		return null;
	}
}

export async function addToCart(variantId: string, quantity = 1) {
	const cookieStore = await cookies();
	const cartId = cookieStore.get("cartId")?.value;

	const cart = await commerce.cartUpsert({
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
	const fullCart = await commerce.cartGet({ cartId: cart.id });

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
		await commerce.cartUpsert({
			cartId,
			variantId,
			quantity: 0,
		});

		// Fetch updated cart
		const cart = await commerce.cartGet({ cartId });
		return { success: true, cart };
	} catch {
		return { success: false, cart: null };
	}
}

// Set absolute quantity for a cart item
export async function setCartQuantity(variantId: string, quantity: number) {
	const cookieStore = await cookies();
	const cartId = cookieStore.get("cartId")?.value;

	if (!cartId) {
		return { success: false, cart: null };
	}

	try {
		if (quantity <= 0) {
			// Remove item
			await commerce.cartUpsert({ cartId, variantId, quantity: 0 });
		} else {
			// cartUpsert treats quantity as additive, so remove first then re-add
			// with the exact quantity we want
			await commerce.cartUpsert({ cartId, variantId, quantity: 0 });
			await commerce.cartUpsert({ cartId, variantId, quantity });
		}

		// Fetch updated cart
		const cart = await commerce.cartGet({ cartId });
		return { success: true, cart };
	} catch {
		return { success: false, cart: null };
	}
}
