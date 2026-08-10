"use server";

import { try_ } from "safe-try";
import { commerce } from "@/lib/commerce";
import { CURRENCY } from "@/lib/constants";
import { getCartCookieJson, setCartCookie } from "@/lib/cookies";

export async function getCart() {
	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
		return null;
	}

	const [error, cart] = await try_(commerce.cartGet({ cartId: cartCookie.id }));
	if (error) {
		console.error("cart: cartGet failed", { cartId: cartCookie.id, error });
		return null;
	}
	return cart;
}

export async function addToCart(variantId: string, quantity = 1) {
	const cartCookie = await getCartCookieJson();

	// The yns_cart cookie can point at a cartId that no longer exists server-side
	// (expired, store re-seeded, old session). cartUpsert then throws "Cart not found";
	// retry once with a FRESH cart so the add always lands. No revalidatePath — the
	// client syncs from this action's returned cart (the layout cartGet hits a
	// read-replica and can return the pre-write cart, dropping the just-added line).
	let [error, cart] = await try_(commerce.cartUpsert({ cartId: cartCookie?.id, variantId, quantity }));
	if (error) {
		[error, cart] = await try_(commerce.cartUpsert({ variantId, quantity }));
		if (error) {
			console.error("cart: addToCart failed after fresh-cart retry", { variantId, quantity, error });
			return { success: false, cart: null };
		}
	}

	if (!cart) {
		return { success: false, cart: null };
	}

	if (cart.id !== cartCookie?.id) {
		await setCartCookie({ id: cart.id });
	}

	return { success: true, cart };
}

export async function addBundleToCart(
	bundleId: string,
	selections: Array<{ variantId: string; groupId: string; quantity: number }>,
) {
	const cartCookie = await getCartCookieJson();

	const [error, cart] = await try_(
		commerce.cartAddBundle({
			cartId: cartCookie?.id,
			bundleId,
			selections,
			currency: CURRENCY,
		}),
	);

	if (error) {
		// The SDK throws on a 4xx; surface a readable message. Precise per-group validation
		// is handled client-side in the bundle builder — this is the server backstop.
		console.error("cart: addBundleToCart failed", { bundleId, error });
		const message = error instanceof Error ? error.message : "Could not add bundle to cart";
		return { success: false as const, error: message };
	}

	if (!cart) {
		return { success: false as const, error: "Could not add bundle to cart" };
	}

	if (cart.id !== cartCookie?.id) {
		await setCartCookie({ id: cart.id });
	}

	return { success: true as const, cart };
}

export async function removeFromCart(variantId: string) {
	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
		return { success: false, cart: null };
	}

	// Quantity 0 removes the item; the response is the updated cart
	const [error, cart] = await try_(
		commerce.cartUpsert({
			cartId: cartCookie.id,
			variantId,
			quantity: 0,
		}),
	);
	if (error) {
		console.error("cart: removeFromCart failed", { cartId: cartCookie.id, variantId, error });
		return { success: false, cart: null };
	}
	return { success: true, cart };
}

// Set absolute quantity for a cart item
export async function setCartQuantity(variantId: string, quantity: number) {
	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
		return { success: false, cart: null };
	}

	// mode "set" replaces the line quantity atomically; 0 removes the item
	const [error, cart] = await try_(
		commerce.cartUpsert({
			cartId: cartCookie.id,
			variantId,
			quantity: Math.max(quantity, 0),
			mode: "set",
		}),
	);
	if (error) {
		console.error("cart: setCartQuantity failed", { cartId: cartCookie.id, variantId, quantity, error });
		return { success: false, cart: null };
	}
	return { success: true, cart };
}
