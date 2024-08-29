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

export async function addToCartAction(formData: FormData) {
	const productId = formData.get("productId");
	if (!productId || typeof productId !== "string") {
		throw new Error("Invalid product ID");
	}

	const cart = await getCartFromCookiesAction();

	const updatedCart = await Commerce.cartAdd({ productId, cartId: cart?.cart.id });

	if (updatedCart) {
		setCartCookieJson({
			id: updatedCart.id,
			linesCount: Commerce.cartCount(updatedCart.metadata),
		});

		revalidateTag(`cart-${updatedCart.id}`);
	}
	revalidatePath("/cart");
	revalidatePath("/cart-overlay");
}

export async function increaseQuantity(productId: string) {
	const cart = await getCartFromCookiesAction();
	if (!cart) {
		throw new Error("Cart not found");
	}
	await Commerce.cartChangeQuantity({
		productId,
		cartId: cart.cart.id,
		operation: "INCREASE",
	});
}

export async function decreaseQuantity(productId: string) {
	const cart = await getCartFromCookiesAction();
	if (!cart) {
		throw new Error("Cart not found");
	}
	await Commerce.cartChangeQuantity({
		productId,
		cartId: cart.cart.id,
		operation: "DECREASE",
	});
}

export async function setQuantity({
	productId,
	cartId,
	quantity,
}: {
	productId: string;
	cartId: string;
	quantity: number;
}) {
	const cart = await getCartFromCookiesAction();
	if (!cart) {
		throw new Error("Cart not found");
	}
	await Commerce.cartSetQuantity({ productId, cartId, quantity });
}
