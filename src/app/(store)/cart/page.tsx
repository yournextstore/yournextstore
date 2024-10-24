import { getCartFromCookiesAction } from "@/actions/cart-actions";
import { getTranslations } from "@/i18n/server";
import { CheckoutCard } from "@/ui/checkout/checkout-card";
import type { Metadata } from "next/types";

export const generateMetadata = async (): Promise<Metadata> => {
	const t = await getTranslations("/cart.metadata");
	return {
		title: t("title"),
	};
};

export default async function CartPage() {
	const cart = await getCartFromCookiesAction();
	if (!cart) {
		return null;
	}

	return <CheckoutCard cart={cart} />;
}
