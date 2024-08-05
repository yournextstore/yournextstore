"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import * as Commerce from "commerce-kit";
import { clearCartCookie, getCartCookieJson, setCartCookieJson } from "@/lib/cart";

export async function getCartFromCookiesAction() {
	const cartJson = getCartCookieJson();
	if (!cartJson) {
		return null;
	}

	const cart = await Commerce.cartGet(cartJson.id);
	if (cart) {
		return cart;
	}
	return null;
}

export async function findOrCreateCartIdFromCookiesAction() {
	const cart = await getCartFromCookiesAction();
	if (cart) {
		return cart;
	}

	const newCart = await Commerce.cartCreate();
	setCartCookieJson({
		id: newCart.id,
		linesCount: 0,
	});
	revalidateTag(`cart-${newCart.id}`);
	revalidatePath("/cart");
	revalidatePath("/cart-overlay");

	return newCart.id;
}

export async function clearCartCookieAction() {
	const cookie = getCartCookieJson();
	if (!cookie) {
		return;
	}

	clearCartCookie();
	revalidateTag(`cart-${cookie.id}`);
	// FIXME not ideal, revalidate per domain instead (multi-tenant)
	revalidateTag(`admin-orders`);
	revalidatePath("/cart");
	revalidatePath("/cart-overlay");
}
