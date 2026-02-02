import { invariant } from "./invariant";

export const formatMoney = ({ amount: minor, currency, locale }: MoneyInt & { locale: string }) => {
	const amount = getDecimalAmountFromInt({ amount: minor, currency });
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency,
		currencyDisplay: "symbol",
	}).format(Number.parseFloat(amount));
};

const getDecimalsForCurrency = (currency: string) => {
	invariant(currency.length === 3, "currency needs to be a 3-letter code");

	const stripeDecimals = edgeCaseCurrencies[currency.toUpperCase() as EdgeCaseCurrenciesSymbol] as
		| EdgeCaseCurrencies[EdgeCaseCurrenciesSymbol]
		| undefined;
	const decimals = stripeDecimals ?? 2;
	return decimals;
};

const getMultiplierForCurrency = (currency: string) => {
	const decimals = getDecimalsForCurrency(currency);
	return (10 ** decimals) as 1 | 100 | 1000;
};

const getDecimalAmountFromInt = ({ amount: minor, currency }: MoneyInt) => {
	const multiplier = getMultiplierForCurrency(currency);
	return (Number(minor) / multiplier).toFixed(getDecimalsForCurrency(currency));
};

// https://docs.stripe.com/currencies#zero-decimal
const edgeCaseCurrencies = {
	BIF: 0,
	CLP: 0,
	DJF: 0,
	GNF: 0,
	JPY: 0,
	KMF: 0,
	KRW: 0,
	MGA: 0,
	PYG: 0,
	RWF: 0,
	UGX: 0,
	VND: 0,
	VUV: 0,
	XAF: 0,
	XOF: 0,
	XPF: 0,

	BHD: 3,
	JOD: 3,
	KWD: 3,
	OMR: 3,
	TND: 3,
} as const;
type EdgeCaseCurrencies = typeof edgeCaseCurrencies;
type EdgeCaseCurrenciesSymbol = keyof EdgeCaseCurrencies;
type MoneyInt = { amount: string | bigint | number; currency: string };
