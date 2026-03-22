"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CURRENCY_COOKIE, type Currency } from "@/lib/currency";

type CurrencyContextType = {
	currency: Currency;
	setCurrency: (currency: Currency) => void;
};

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({
	defaultCurrency,
	children,
}: {
	defaultCurrency: Currency;
	children: React.ReactNode;
}) {
	const [currency] = useState<Currency>(defaultCurrency);

	const setCurrency = useCallback((newCurrency: Currency) => {
		document.cookie = `${CURRENCY_COOKIE}=${newCurrency};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
		window.location.reload();
	}, []);

	const value = useMemo(() => ({ currency, setCurrency }), [currency, setCurrency]);

	return <CurrencyContext value={value}>{children}</CurrencyContext>;
}

export function useCurrency(): CurrencyContextType {
	const context = useContext(CurrencyContext);
	if (!context) {
		throw new Error("useCurrency must be used within a CurrencyProvider");
	}
	return context;
}
