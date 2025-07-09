"use server";

import * as Commerce from "commerce-kit";
import { getCartFromCookiesAction } from "@/actions/cart-actions";

export const saveTaxIdAction = async ({ taxId }: { taxId: string }) => {
	const cart = await getCartFromCookiesAction();
	if (!cart) {
		throw new Error("No cart id found in cookies");
	}

	await Commerce.cartSaveTax({ cartId: cart.cart.id, taxId });
};
