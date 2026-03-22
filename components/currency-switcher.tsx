"use client";

import { useCurrency } from "@/components/currency-provider";
import { CURRENCY_SYMBOLS, type Currency } from "@/lib/currency";

export function CurrencySwitcher({ currencies }: { currencies: string[] }) {
	const { currency, setCurrency } = useCurrency();

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setCurrency(e.target.value as Currency);
	};

	return (
		<select
			value={currency}
			onChange={handleChange}
			aria-label="Currency"
			className="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
		>
			{currencies.map((cur) => (
				<option key={cur} value={cur}>
					{CURRENCY_SYMBOLS[cur as Currency] ?? cur} {cur}
				</option>
			))}
		</select>
	);
}
