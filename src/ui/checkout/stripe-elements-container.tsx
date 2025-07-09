"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, type StripeElementLocale, type StripeElementsOptions } from "@stripe/stripe-js";
import { type ReactNode, useMemo } from "react";
import { env } from "@/env.mjs";
import { invariant } from "@/lib/invariant";

export const StripeElementsContainer = ({
	children,
	clientSecret,
	publishableKey,
	stripeAccount,
	locale: currentLocale,
}: {
	children: ReactNode;
	clientSecret?: string;
	publishableKey?: string;
	stripeAccount?: string;
	locale: string;
}) => {
	const stripePublishableKey = publishableKey || env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
	invariant(stripePublishableKey, "Stripe publishable key is required");
	const stripePromise = useMemo(
		() => loadStripe(stripePublishableKey, { stripeAccount }),
		[stripePublishableKey],
	);

	if (!clientSecret) {
		return null;
	}

	const locale = supportedStripeLocales.includes(currentLocale) ? currentLocale : ("auto" as const);

	const options = {
		clientSecret: clientSecret,
		appearance: {
			variables: {
				fontFamily: `ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
				fontSizeSm: "0.875rem",
				colorDanger: "hsl(0 84.2% 60.2%)",
			},
		},
		locale,
	} satisfies StripeElementsOptions;

	return (
		<Elements stripe={stripePromise} options={options}>
			{children}
		</Elements>
	);
};

// This was taken from `StripeElementLocale` in `@stripe/react-stripe-js`:
const supportedStripeLocales = [
	"ar",
	"bg",
	"cs",
	"da",
	"de",
	"el",
	"en",
	"en-AU",
	"en-CA",
	"en-NZ",
	"en-GB",
	"es",
	"es-ES",
	"es-419",
	"et",
	"fi",
	"fil",
	"fr",
	"fr-CA",
	"fr-FR",
	"he",
	"hu",
	"hr",
	"id",
	"it",
	"it-IT",
	"ja",
	"ko",
	"lt",
	"lv",
	"ms",
	"mt",
	"nb",
	"nl",
	"no",
	"pl",
	"pt",
	"pt-BR",
	"ro",
	"ru",
	"sk",
	"sl",
	"sv",
	"th",
	"tr",
	"vi",
	"zh",
	"zh-HK",
	"zh-TW",
] satisfies StripeElementLocale[];
