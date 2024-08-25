import { type ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import * as Commerce from "commerce-kit";
import { getCartFromCookiesAction } from "@/actions/cartActions";

import { CartSummaryTable } from "@/ui/checkout/CartSummaryTable";
import { CartEmpty } from "@/ui/checkout/CartEmpty";
import { StripeElementsContainer } from "@/ui/checkout/StripeElementsContainer";

export default async function CartLayout({ children }: { children: ReactNode }) {
	const cart = await getCartFromCookiesAction();
	if (!cart?.cart.client_secret || cart.lines.length === 0) {
		return <CartEmpty />;
	}
	const { stripeAccount, publishableKey } = await Commerce.contextGet();
	const t = await getTranslations("/cart.page");

	return (
		<StripeElementsContainer
			clientSecret={cart.cart.client_secret}
			publishableKey={publishableKey}
			stripeAccount={stripeAccount}
		>
			<div className="min-h-[calc(100dvh-7rem)] xl:grid xl:grid-cols-12 xl:gap-x-8">
				<div className="my-8 xl:col-span-7">
					<div className="sticky top-1">
						<h1 className="mb-4 text-3xl font-bold leading-none tracking-tight">{t("title")}</h1>
						<CartSummaryTable cart={structuredClone(cart)} />
					</div>
				</div>
				<div className="my-8 max-w-[65ch] xl:col-span-5">{children}</div>
			</div>
		</StripeElementsContainer>
	);
}
