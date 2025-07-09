"use client";

import { createContext, type ReactNode, use } from "react";
import { invariant } from "@/lib/utils";
import { getMessagesInternal } from "./server";
import type { IntlNamespaceKeys } from "./types";

type IntlClientProviderValue = { messages: IntlMessages; locale: string };
const IntlClientContext = createContext<IntlClientProviderValue | null>(null);

export const IntlClientProvider = ({
	messages,
	locale,
	children,
}: {
	messages: IntlMessages;
	locale: string;
	children: ReactNode;
}) => {
	return <IntlClientContext value={{ locale, messages }}>{children}</IntlClientContext>;
};

export const useTranslations = <TNamespaceKey extends IntlNamespaceKeys = never>(
	namespaceKey: TNamespaceKey,
) => {
	const ctx = use(IntlClientContext);
	invariant(ctx, "useTranslations must be used within a IntlClientProvider");
	return getMessagesInternal(namespaceKey, ctx.locale, ctx.messages);
};
