"use server";

import type { APICartCreateBody } from "commerce-kit";
import {
	addCartBundle,
	addCartLine,
	applyCartDiscount,
	removeCartDiscount,
	setCartLineQuantity,
} from "@/lib/cart";

export async function addToCart(
	variantId: string,
	quantity = 1,
	subscriptionPlanId?: string | null,
	properties?: APICartCreateBody["properties"],
) {
	return addCartLine(variantId, quantity, subscriptionPlanId, properties);
}

export async function addBundleToCart(
	bundleId: string,
	selections: Array<{ variantId: string; groupId: string; quantity: number }>,
) {
	return addCartBundle(bundleId, selections);
}

export async function setCartQuantity(
	variantId: string,
	quantity: number,
	subscriptionPlanId?: string | null,
	properties?: APICartCreateBody["properties"],
) {
	return setCartLineQuantity(variantId, quantity, subscriptionPlanId, properties);
}

export async function applyDiscountCode(rawCode: string, itemCount: number) {
	return applyCartDiscount(rawCode, itemCount);
}

export async function removeDiscountCode() {
	return removeCartDiscount();
}
