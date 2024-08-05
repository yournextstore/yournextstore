import { getRequestConfig } from "next-intl/server";
import { env } from "@/env.mjs";
type En = typeof import("../messages/en.json");

export default getRequestConfig(async () => {
	const locale = env.NEXT_PUBLIC_LANGUAGE;

	return {
		locale,
		messages: ((await import(`../messages/${locale}.json`)) as { default: En }).default,
	};
});
