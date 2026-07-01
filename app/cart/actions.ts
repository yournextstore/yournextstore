"use server";

import { revalidatePath } from "next/cache";
import { commerce } from "@/lib/commerce";
import { CURRENCY } from "@/lib/constants";
import { getCartCookieJson, setCartCookie } from "@/lib/cookies";

export async function getCart() {
	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
		return null;
	}

	try {
		return await commerce.cartGet({ cartId: cartCookie.id });
	} catch {
		return null;
	}
}

export async function addToCart(variantId: string, quantity = 1) {
	const cartCookie = await getCartCookieJson();

	const cart = await commerce.cartUpsert({
		cartId: cartCookie?.id,
		variantId,
		quantity,
	});

	if (!cart) {
		return { success: false, cart: null };
	}

	if (cart.id !== cartCookie?.id) {
		await setCartCookie({ id: cart.id });
	}
	revalidatePath("/", "layout");

	return { success: true, cart };
}

export async function addBundleToCart(
	bundleId: string,
	selections: Array<{ variantId: string; groupId: string; quantity: number }>,
) {
	const cartCookie = await getCartCookieJson();

	try {
		const cart = await commerce.cartAddBundle({
			cartId: cartCookie?.id,
			bundleId,
			selections,
			currency: CURRENCY,
		});

		if (!cart) {
			return { success: false as const, error: "Could not add bundle to cart" };
		}

		if (cart.id !== cartCookie?.id) {
			await setCartCookie({ id: cart.id });
		}
		revalidatePath("/", "layout");

		return { success: true as const, cart };
	} catch (error) {
		// The SDK throws on a 4xx; surface a readable message. Precise per-group validation
		// is handled client-side in the bundle builder — this is the server backstop.
		const message = error instanceof Error ? error.message : "Could not add bundle to cart";
		return { success: false as const, error: message };
	}
}

export async function removeFromCart(variantId: string) {
	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
		return { success: false, cart: null };
	}

	try {
		// Quantity 0 removes the item; the response is the updated cart
		const cart = await commerce.cartUpsert({
			cartId: cartCookie.id,
			variantId,
			quantity: 0,
		});
		return { success: true, cart };
	} catch {
		return { success: false, cart: null };
	}
}

// Set absolute quantity for a cart item
export async function setCartQuantity(variantId: string, quantity: number) {
	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
		return { success: false, cart: null };
	}

	try {
		// mode "set" replaces the line quantity atomically; 0 removes the item
		const cart = await commerce.cartUpsert({
			cartId: cartCookie.id,
			variantId,
			quantity: Math.max(quantity, 0),
			mode: "set",
		});
		return { success: true, cart };
	} catch {
		return { success: false, cart: null };
	}
}
