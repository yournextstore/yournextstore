import { env } from "@/env.mjs";
import { IntlMessageFormat } from "intl-messageformat";
import type { IntlNamespaceKeys, NamespacedKeys } from "./types";

type En = typeof import("../../messages/en-US.json");

export const getLocale = async () => env.NEXT_PUBLIC_LANGUAGE;
export const getMessages = async () =>
	(
		(await import(`../../messages/${await getLocale()}.json`)) as {
			default: En;
		}
	).default;

export const getTranslations = async <TNamespaceKey extends IntlNamespaceKeys = never>(
	namespaceKey: TNamespaceKey,
) => {
	const messages = await getMessages();
	const locale = await getLocale();
	return getMessagesInternal(namespaceKey, locale, messages);
};

export const getMessagesInternal = <TNamespaceKey extends IntlNamespaceKeys = never>(
	namespaceKey: TNamespaceKey,
	locale: string,
	messages: IntlMessages,
) => {
	return <TMessageKey extends NamespacedKeys<IntlMessages, TNamespaceKey> = never>(
		key: TMessageKey,
		values?: Record<string, string | number | undefined>,
	) => {
		const completeKey = namespaceKey + "." + key;
		const msg = messages[completeKey as keyof typeof messages];
		const message = new IntlMessageFormat(msg, locale).format(values)?.toString() ?? "";
		return message;
	};
};
