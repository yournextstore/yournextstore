"use server";

import { cookies } from "next/headers";
import { ynsClient } from "../../../src/yns-client";

export async function addToCart(variantId: string) {
	const cookieStore = await cookies();
	const cartId = cookieStore.get("cartId")?.value;

	const cart = await ynsClient.cartCreate({
		cartId,
		variantId,
		quantity: 1,
	});

	if (!cart) {
		return { success: false };
	}

	cookieStore.set("cartId", cart.id, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 60 * 60 * 24 * 30, // 30 days
	});

	return { success: true, cartId: cart.id };
}
