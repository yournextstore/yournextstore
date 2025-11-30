"use server";

<<<<<<< HEAD:app/cart/actions.ts
import { commerce } from "@/lib/commerce";
import { getCartCookieJson, setCartCookie } from "@/lib/cookies";

export async function getCart() {
	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
=======
import { cookies } from "next/headers";
import { ynsClient } from "../../lib/yns-client";

export async function getCart() {
	const cookieStore = await cookies();
	const cartId = cookieStore.get("cartId")?.value;

	if (!cartId) {
>>>>>>> 74ad60e (feat: optimistic update):src/app/cart/actions.ts
		return null;
	}

	try {
<<<<<<< HEAD:app/cart/actions.ts
		return await commerce.cartGet({ cartId: cartCookie.id });
=======
		return await ynsClient.cartGet({ cartId });
>>>>>>> 74ad60e (feat: optimistic update):src/app/cart/actions.ts
	} catch {
		return null;
	}
}

export async function addToCart(variantId: string, quantity = 1) {
<<<<<<< HEAD:app/cart/actions.ts
	const cartCookie = await getCartCookieJson();

	const cart = await commerce.cartUpsert({
		cartId: cartCookie?.id,
=======
	const cookieStore = await cookies();
	const cartId = cookieStore.get("cartId")?.value;

	const cart = await ynsClient.cartUpsert({
		cartId,
>>>>>>> 74ad60e (feat: optimistic update):src/app/cart/actions.ts
		variantId,
		quantity,
	});

	if (!cart) {
		return { success: false, cart: null };
	}

<<<<<<< HEAD:app/cart/actions.ts
	await setCartCookie({ id: cart.id });

	// Fetch full cart data to sync with client
	const fullCart = await commerce.cartGet({ cartId: cart.id });
=======
	cookieStore.set("cartId", cart.id, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 60 * 60 * 24 * 30, // 30 days
	});

	// Fetch full cart data to sync with client
	const fullCart = await ynsClient.cartGet({ cartId: cart.id });
>>>>>>> 74ad60e (feat: optimistic update):src/app/cart/actions.ts

	return { success: true, cart: fullCart };
}

export async function removeFromCart(variantId: string) {
<<<<<<< HEAD:app/cart/actions.ts
	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
=======
	const cookieStore = await cookies();
	const cartId = cookieStore.get("cartId")?.value;

	if (!cartId) {
>>>>>>> 74ad60e (feat: optimistic update):src/app/cart/actions.ts
		return { success: false, cart: null };
	}

	try {
		// Set quantity to 0 to remove the item
<<<<<<< HEAD:app/cart/actions.ts
		await commerce.cartUpsert({
			cartId: cartCookie.id,
=======
		await ynsClient.cartUpsert({
			cartId,
>>>>>>> 74ad60e (feat: optimistic update):src/app/cart/actions.ts
			variantId,
			quantity: 0,
		});

		// Fetch updated cart
<<<<<<< HEAD:app/cart/actions.ts
		const cart = await commerce.cartGet({ cartId: cartCookie.id });
=======
		const cart = await ynsClient.cartGet({ cartId });
>>>>>>> 74ad60e (feat: optimistic update):src/app/cart/actions.ts
		return { success: true, cart };
	} catch {
		return { success: false, cart: null };
	}
}

// Set absolute quantity for a cart item
<<<<<<< HEAD:app/cart/actions.ts
export async function setCartQuantity(variantId: string, quantity: number) {
	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
=======
// Calculates delta internally since cartUpsert uses delta behavior
export async function setCartQuantity(variantId: string, quantity: number) {
	const cookieStore = await cookies();
	const cartId = cookieStore.get("cartId")?.value;

	if (!cartId) {
>>>>>>> 74ad60e (feat: optimistic update):src/app/cart/actions.ts
		return { success: false, cart: null };
	}

	try {
<<<<<<< HEAD:app/cart/actions.ts
		if (quantity <= 0) {
			// Remove item
			await commerce.cartUpsert({ cartId: cartCookie.id, variantId, quantity: 0 });
		} else {
			// cartUpsert treats quantity as additive, so remove first then re-add
			// with the exact quantity we want
			await commerce.cartUpsert({ cartId: cartCookie.id, variantId, quantity: 0 });
			await commerce.cartUpsert({ cartId: cartCookie.id, variantId, quantity });
		}

		// Fetch updated cart
		const cart = await commerce.cartGet({ cartId: cartCookie.id });
=======
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
>>>>>>> 74ad60e (feat: optimistic update):src/app/cart/actions.ts
		return { success: true, cart };
	} catch {
		return { success: false, cart: null };
	}
}
