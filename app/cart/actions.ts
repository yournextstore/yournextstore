"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { commerce } from "@/lib/commerce";
import { getCartCookieJson, setCartCookie } from "@/lib/cookies";
import { PREVIEW_HOST_MARKER, PREVIEW_HOST_SUFFIX } from "@/lib/demo-products";

async function isPreviewRequest(previewFlag: boolean | undefined): Promise<boolean> {
	if (!previewFlag) return false;
	const hdrs = await headers();
	const host = (hdrs.get("host") ?? "").toLowerCase();
	return host.includes(PREVIEW_HOST_MARKER) || host.endsWith(PREVIEW_HOST_SUFFIX);
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

export async function addToCart(variantId: string, quantity = 1, preview?: boolean) {
	if (await isPreviewRequest(preview)) {
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

export async function removeFromCart(variantId: string, preview?: boolean) {
	if (await isPreviewRequest(preview)) {
		return { success: true, cart: null };
	}

	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
		return { success: false, cart: null };
	}

	try {
		await commerce.cartUpsert({
			cartId: cartCookie.id,
			variantId,
			quantity: 0,
		});

		const cart = await commerce.cartGet({ cartId: cartCookie.id });
		return { success: true, cart };
	} catch {
		return { success: false, cart: null };
	}
}

export async function setCartQuantity(variantId: string, quantity: number, preview?: boolean) {
	if (await isPreviewRequest(preview)) {
		return { success: true, cart: null };
	}

	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
		return { success: false, cart: null };
	}

	try {
		if (quantity <= 0) {
			await commerce.cartUpsert({ cartId: cartCookie.id, variantId, quantity: 0 });
		} else {
			await commerce.cartUpsert({ cartId: cartCookie.id, variantId, quantity: 0 });
			await commerce.cartUpsert({ cartId: cartCookie.id, variantId, quantity });
		}

		const cart = await commerce.cartGet({ cartId: cartCookie.id });
		return { success: true, cart };
	} catch {
		return { success: false, cart: null };
	}
}
