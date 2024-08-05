import { getTranslations } from "next-intl/server";
import * as Commerce from "commerce-kit";
import amex from "@/images/payments/amex.svg";
import blik from "@/images/payments/blik.svg";
import google_pay from "@/images/payments/google_pay.svg";
import klarna from "@/images/payments/klarna.svg";
import link from "@/images/payments/link.svg";
import mastercard from "@/images/payments/mastercard.svg";
import p24 from "@/images/payments/p24.svg";
import visa from "@/images/payments/visa.svg";
import { StripePayment } from "@/ui/checkout/stripePayment";

export const paymentMethods = {
	amex,
	blik,
	google_pay,
	klarna,
	link,
	mastercard,
	p24,
	visa,
};

export const CheckoutCard = async ({ cart }: { cart: Commerce.Cart["cart"] }) => {
	const shippingRates = await Commerce.shippingBrowse();
	const t = await getTranslations("/cart.page");

	return (
		<section className="max-w-md pb-12">
			<h2 className="text-3xl font-bold leading-none tracking-tight">{t("checkoutTitle")}</h2>
			<p className="mb-4 mt-2 text-sm text-muted-foreground">{t("checkoutDescription")}</p>
			<StripePayment
				shippingRateId={cart.metadata.shippingRateId}
				shippingRates={structuredClone(shippingRates.data)}
			/>
		</section>
	);
};
