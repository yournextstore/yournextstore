import { cacheLife } from "next/cache";
import { try_ } from "safe-try";
import { commerce } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";
import type { TaxBehavior } from "@/lib/pricing";

// The store's configured currency/locale/tax behaviour with static fallbacks. Cached
// (not request-time) so consumers can stay part of the prerendered shell. Cached for
// MINUTES, not hours: `taxBehavior` decides whether every price on the storefront reads
// net or gross, and a merchant flipping it should see it as fast as a price edit.
// Reads /me directly: through meGetCached this entry would re-read that cache, whose
// default lifetime keeps serving the old settings for up to 15 minutes.
export async function getStoreConfig() {
	"use cache";
	cacheLife("minutes");

	const [error, me] = await try_(commerce.meGet());
	if (error) {
		return { currency: CURRENCY, locale: LOCALE, taxBehavior: "inclusive" as TaxBehavior };
	}
	return {
		currency: me.store.currency || CURRENCY,
		locale: me.store.locale || LOCALE,
		taxBehavior: (me.store.taxBehavior || "inclusive") as TaxBehavior,
	};
}
