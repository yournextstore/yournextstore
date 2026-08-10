import { cacheLife } from "next/cache";
import { try_ } from "safe-try";
import { meGetCached } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";

// The store's configured currency/locale with static fallbacks. Cached (not
// request-time) so consumers can stay part of the prerendered shell.
export async function getStoreConfig() {
	"use cache";
	cacheLife("hours");

	const [error, me] = await try_(meGetCached());
	if (error) {
		return { currency: CURRENCY, locale: LOCALE };
	}
	return {
		currency: me.store.currency || CURRENCY,
		locale: me.store.locale || LOCALE,
	};
}
