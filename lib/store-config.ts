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
		return { currency: CURRENCY, locale: LOCALE, language: null, taxBehavior: "inclusive" as TaxBehavior };
	}
	// The storefront's default language is what shoppers read here: it formats prices and is
	// reported to the platform on every cart and newsletter signup, so checkout, the account and
	// every email speak it too. `store.locale` is the merchant's admin language and only a last resort.
	const language = me.store.settings?.defaultLanguage ?? null;
	return {
		currency: me.store.currency || CURRENCY,
		locale: language || me.store.locale || LOCALE,
		language,
		taxBehavior: (me.store.taxBehavior || "inclusive") as TaxBehavior,
	};
}
