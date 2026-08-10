"use client";

import { createContext, useContext } from "react";
import { CURRENCY, LOCALE } from "@/lib/constants";

type StoreConfig = { currency: string; locale: string };

// Fallback constants only apply when a component renders outside the provider (tests, isolated previews).
const StoreConfigContext = createContext<StoreConfig>({ currency: CURRENCY, locale: LOCALE });

export function StoreConfigProvider({ value, children }: { value: StoreConfig; children: React.ReactNode }) {
	return <StoreConfigContext.Provider value={value}>{children}</StoreConfigContext.Provider>;
}

export function useStoreConfig() {
	return useContext(StoreConfigContext);
}
