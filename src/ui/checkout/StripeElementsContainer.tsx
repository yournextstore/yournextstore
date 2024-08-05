"use client";

import { Elements } from "@stripe/react-stripe-js";
import type { ReactNode } from "react";
import {
	loadStripe,
	type StripeElementLocale,
	type StripeElementsOptions,
} from "@stripe/stripe-js";
import { useLocale } from "next-intl";
import { env } from "@/env.mjs";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export const StripeElementsContainer = ({
	children,
	client_secret,
}: {
	children: ReactNode;
	client_secret?: string;
}) => {
	const currentLocale = useLocale();
	if (!client_secret) {
		return null;
	}

	const locale = supportedStripeLocales.includes(currentLocale) ? currentLocale : ("auto" as const);

	const options = {
		clientSecret: client_secret,
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
