import { env } from "@/env.mjs";
import { getRequestConfig } from "next-intl/server";
type En = typeof import("../messages/en.json");

export default getRequestConfig(async () => {
	const locale = env.NEXT_PUBLIC_LANGUAGE;

	return {
		locale,
		messages: ((await import(`../messages/${locale}.json`)) as { default: En }).default,
	};
});
