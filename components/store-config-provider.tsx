"use client";

import { createContext, useContext } from "react";
import { CURRENCY, LOCALE } from "@/lib/constants";
import type { TaxBehavior } from "@/lib/pricing";

// `language` is the storefront's default language as the platform spells it (e.g. "pl-PL"), or null
// for a store that never set one; `locale` is what prices and dates format in.
type StoreConfig = { currency: string; locale: string; language: string | null; taxBehavior: TaxBehavior };

// Fallback constants only apply when a component renders outside the provider (tests, isolated previews).
const StoreConfigContext = createContext<StoreConfig>({
	currency: CURRENCY,
	locale: LOCALE,
	language: null,
	taxBehavior: "inclusive",
});

export function StoreConfigProvider({ value, children }: { value: StoreConfig; children: React.ReactNode }) {
	return <StoreConfigContext.Provider value={value}>{children}</StoreConfigContext.Provider>;
}

export function useStoreConfig() {
	return useContext(StoreConfigContext);
}
