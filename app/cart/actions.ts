"use server";

import { try_ } from "safe-try";
import { refusedCodeMessage } from "@/app/cart/discount-code";
import { commerce } from "@/lib/commerce";
import { getCartCookieJson, setCartCookie } from "@/lib/cookies";
import { getStoreConfig } from "@/lib/store-config";

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
	const [cartCookie, { currency }] = await Promise.all([getCartCookieJson(), getStoreConfig()]);

	const [error, cart] = await try_(
		commerce.cartAddBundle({
			cartId: cartCookie?.id,
			bundleId,
			selections,
			currency,
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

const REMOVE_CODE_FAILED = "Couldn't remove the code. Try again.";

export async function applyDiscountCode(rawCode: string, itemCount: number) {
	const code = rawCode.trim();
	const cartCookie = await getCartCookieJson();
	if (!code || !cartCookie?.id) {
		return { success: false as const, error: "Add something to your cart first" };
	}

	const [error, cart] = await try_(commerce.cartCouponApply({ cartId: cartCookie.id, code }));
	if (!error) {
		return { success: true as const, cart };
	}

	// The SDK only passes on "Coupon cannot be applied", so read the coupon to say why.
	const [couponError, coupon] = await try_(commerce.couponGet({ idOrCode: code }));
	if (couponError) {
		console.error("cart: applyDiscountCode failed", { cartId: cartCookie.id, error, couponError });
		return { success: false as const, error: "Couldn't apply the code. Try again." };
	}
	return { success: false as const, error: refusedCodeMessage(coupon, itemCount, new Date()) };
}

export async function removeDiscountCode() {
	const cartCookie = await getCartCookieJson();
	if (!cartCookie?.id) {
		return { success: false as const, error: REMOVE_CODE_FAILED };
	}

	const [error] = await try_(commerce.cartCouponRemove({ cartId: cartCookie.id }));
	if (error) {
		console.error("cart: removeDiscountCode failed", { cartId: cartCookie.id, error });
		return { success: false as const, error: REMOVE_CODE_FAILED };
	}
	// The remove endpoint answers `{ ok }`; the drawer needs the re-priced cart.
	const [, cart] = await try_(commerce.cartGet({ cartId: cartCookie.id }));
	return { success: true as const, cart };
}
