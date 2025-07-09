"use server";

import * as Commerce from "commerce-kit";
import { getCartFromCookiesAction } from "@/actions/cart-actions";
import type { AddressSchema } from "@/ui/checkout/checkout-form-schema";

export const saveShippingRateAction = async ({ shippingRateId }: { shippingRateId: string }) => {
	const cart = await getCartFromCookiesAction();
	if (!cart) {
		throw new Error("No cart id found in cookies");
	}

	if (!shippingRateId || typeof shippingRateId !== "string") {
		throw new Error("Invalid shipping rate id");
	}

	await Commerce.cartSaveShipping({ cartId: cart.cart.id, shippingRateId });
};

export const saveBillingAddressAction = async ({ billingAddress }: { billingAddress: AddressSchema }) => {
	const cart = await getCartFromCookiesAction();
	if (!cart) {
		throw new Error("No cart id found in cookies");
	}

	await Commerce.cartSaveBillingAddress({ cartId: cart.cart.id, billingAddress });
};
