"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { commerce } from "@/lib/commerce";
import { getCartCookieJson, setCartCookie } from "@/lib/cookies";
import { PREVIEW_HOST_MARKER, PREVIEW_HOST_SUFFIX } from "@/lib/demo-products";

async function isPreviewRequest(): Promise<boolean> {
	const h = await headers();
	const host = (h.get("host") ?? "").toLowerCase();
	if (!host) return false;
	const onPreviewHost = host.includes(PREVIEW_HOST_MARKER) || host.endsWith(PREVIEW_HOST_SUFFIX);
	if (!onPreviewHost) return false;
	const referer = h.get("referer") ?? "";
	const purpose = h.get("sec-fetch-site") ?? "";
	const previewSignal =
		referer.includes("preview=1") || h.get("x-yns-preview") === "1" || purpose === "same-origin";
	return previewSignal && referer.includes("preview=1");
}

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
	if (await isPreviewRequest()) {
		return { success: true, cart: null };
	}

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

	const fullCart = await commerce.cartGet({ cartId: cart.id });

	return { success: true, cart: fullCart };
}

export async function removeFromCart(variantId: string) {
	if (await isPreviewRequest()) {
		return { success: true, cart: null };
	}

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

export async function setCartQuantity(variantId: string, quantity: number) {
	if (await isPreviewRequest()) {
		return { success: true, cart: null };
	}

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
