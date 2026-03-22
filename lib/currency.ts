export const SUPPORTED_CURRENCIES = ["USD", "EUR", "PLN", "GBP", "CHF"] as const;
export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

export const CURRENCY_COOKIE = "yns_currency";

const LOCALE_DEFAULT_CURRENCY: Record<string, Currency> = {
	"en-US": "USD",
	"de-DE": "EUR",
	"es-ES": "EUR",
	"pl-PL": "PLN",
};

export function getCurrencyForLocale(locale: string): Currency {
	return LOCALE_DEFAULT_CURRENCY[locale] ?? "USD";
}

export function isSupportedCurrency(value: string): value is Currency {
	return (SUPPORTED_CURRENCIES as readonly string[]).includes(value);
}

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
	USD: "$",
	EUR: "€",
	PLN: "zł",
	GBP: "£",
	CHF: "CHF",
};

/**
 * Read the user's selected currency from the cookie.
 * Falls back to locale-derived default.
 * Must be called in a non-cached server component (inside Suspense).
 */
export async function getActiveCurrency(locale: string): Promise<string> {
	const { cookies } = await import("next/headers");
	const cookieStore = await cookies();
	const cookieValue = cookieStore.get(CURRENCY_COOKIE)?.value;
	if (cookieValue && isSupportedCurrency(cookieValue)) {
		return cookieValue;
	}
	return getCurrencyForLocale(locale);
}
