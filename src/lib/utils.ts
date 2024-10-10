import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const isDefined = <T>(value: T | null | undefined): value is T =>
	value !== null && value !== undefined;

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const safeJsonParse = (str: string | null | undefined): unknown => {
	if (str === null || str === undefined) {
		return null;
	}
	try {
		return JSON.parse(str);
	} catch {
		return null;
	}
};

type PromiseToTupleResult<T> = [Error, null] | [null, Awaited<T>];
export const unpackPromise = async <T extends Promise<unknown>>(
	promise: T,
): Promise<PromiseToTupleResult<T>> => {
	try {
		const result = await promise;
		return [null, result];
	} catch (maybeError) {
		const error = maybeError instanceof Error ? maybeError : new Error(String(maybeError));
		return [error, null];
	}
};

export const stringToInt = (str: string | number | null | undefined) => {
	if (str === null || str === undefined) {
		return 0;
	}
	if (typeof str === "number") {
		return str;
	}
	const parsed = Number.parseInt(str, 10);
	if (Number.isNaN(parsed)) {
		return 0;
	}
	return parsed;
};

type CardinalWords = Partial<Record<Intl.LDMLPluralRule, string>> & {
	other: string;
};
export const pluralize = (count: number, words: CardinalWords) => {
	const cardinalRules = new Intl.PluralRules("en-US");
	const rule = cardinalRules.select(count);
	return words[rule] ?? words.other;
};

export const getFieldsByPrefix = <Prefix extends string, Obj extends object>(obj: Obj, prefix: Prefix) => {
	const prefixWithDot = prefix + ".";
	return Object.fromEntries(
		Object.entries(obj)
			.filter(([key]) => key.startsWith(prefixWithDot))
			.map(([key, value]) => [key.slice(prefixWithDot.length), value]),
	) as {
		[K in keyof Obj as K extends `${Prefix}.${infer Key}` ? Key : never]: Obj[K];
	};
};

export const addPrefixToFields = <Prefix extends string, Obj extends object>(obj: Obj, prefix: Prefix) => {
	const prefixWithDot = prefix + ".";
	return Object.fromEntries(Object.entries(obj).map(([key, value]) => [prefixWithDot + key, value])) as {
		[K in keyof Obj as `${Prefix}.${K & string}`]: Obj[K];
	};
};

export const slugify = (text: string) => {
	return text
		.toString() // Cast to string (optional)
		.normalize("NFKD") // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
		.toLowerCase() // Convert the string to lowercase letters
		.trim() // Remove whitespace from both sides of a string (optional)
		.replace(/\s+/g, "-") // Replace spaces with -
		.replace(/[^\w-]+/g, "") // Remove all non-word chars
		.replace(/_/g, "-") // Replace _ with -
		.replace(/--+/g, "-") // Replace multiple - with single -
		.replace(/-$/g, ""); // Remove trailing -
};

export const capitalize = (str: string) => (str[0] ? str[0].toUpperCase() + str.slice(1) : "");

export const deslugify = (slug: string) => {
	return slug
		.split("-")
		.map((part) => capitalize(part))
		.join(" ");
};

export const formatProductName = (name: string, variant?: string) => {
	if (!variant) {
		return name;
	}
	return `${name} (${deslugify(variant)})`;
};

export const calculateCartTotalPossiblyWithTax = (cart: {
	cart: {
		amount: number;
		metadata?: { taxCalculationId?: string };
	};
	lines: Array<{
		product: { default_price?: { unit_amount?: number | null } };
		quantity: number;
	}>;
	shippingRate?: { fixed_amount?: { amount?: number } } | null;
}) => {
	if (!cart) {
		return 0;
	}
	if (cart.cart.metadata?.taxCalculationId) {
		return cart.cart.amount;
	}

	return (cart.shippingRate?.fixed_amount?.amount ?? 0) + calculateCartTotalNetWithoutShipping(cart);
};

export const calculateCartTotalNetWithoutShipping = (cart: {
	cart: {
		amount: number;
		metadata?: { taxCalculationId?: string };
	};
	lines: Array<{
		product: { default_price?: { unit_amount?: number | null } };
		quantity: number;
	}>;
	shippingRate?: { fixed_amount?: { amount?: number } } | null;
}) => {
	if (!cart) {
		return 0;
	}

	return cart.lines.reduce(
		(total, { product, quantity }) => total + (product.default_price?.unit_amount ?? 0) * quantity,
		0,
	);
};

type Money = { amount: number; currency: string };

export function invariant(condition: unknown, message: string): asserts condition {
	if (!condition) {
		throw new Error(message);
	}
}

export const assertInteger = (value: number) => {
	invariant(Number.isInteger(value), "Value must be an integer");
};

const getDecimalsForStripe = (currency: string) => {
	invariant(currency.length === 3, "currency needs to be a 3-letter code");

	const stripeDecimals = stripeCurrencies[currency.toUpperCase()];
	const decimals = stripeDecimals ?? 2;
	return decimals;
};

export const getStripeAmountFromDecimal = ({ amount: major, currency }: Money) => {
	const decimals = getDecimalsForStripe(currency);
	const multiplier = 10 ** decimals;
	return Number.parseInt((major * multiplier).toFixed(0), 10);
};

export const getDecimalFromStripeAmount = ({ amount: minor, currency }: Money) => {
	assertInteger(minor);
	const decimals = getDecimalsForStripe(currency);
	const multiplier = 10 ** decimals;
	return Number.parseFloat((minor / multiplier).toFixed(decimals));
};

export const formatMoney = ({ amount: minor, currency, locale = "en-US" }: Money & { locale?: string }) => {
	const amount = getDecimalFromStripeAmount({ amount: minor, currency });
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency,
	}).format(amount);
};

// https://docs.stripe.com/development-resources/currency-codes
const stripeCurrencies: Record<string, number> = {
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
};
