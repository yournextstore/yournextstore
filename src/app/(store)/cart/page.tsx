import { type Metadata } from "next/types";
import { getTranslations } from "next-intl/server";
import { getCartFromCookiesAction } from "@/actions/cartActions";
import { CheckoutCard } from "@/ui/checkout/CheckoutCard";

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

	return <CheckoutCard cart={cart.cart} />;
}
