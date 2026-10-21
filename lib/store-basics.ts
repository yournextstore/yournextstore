import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { getStoreConfig } from "@/lib/store-config";

export type Announcement = { text: string; href: string | null };

/** Store name, logo and the announcement line: the chrome's data, all cached. */
export async function getStoreBasics() {
	"use cache";
	cacheLife("hours");
	const [me, { currency, locale }, collections] = await Promise.all([
		meGetCached().catch(() => null),
		getStoreConfig(),
		commerce.collectionBrowse({ limit: 10 }).catch(() => ({ data: [] })),
	]);
	const settings = me?.store.settings;
	const logo = typeof settings?.logo === "string" ? settings.logo : (settings?.logo?.imageUrl ?? null);
	const threshold = settings?.freeShippingThreshold ? Number(settings.freeShippingThreshold) : 0;

	// Only a threshold the store actually set becomes a delivery promise; otherwise the bar
	// points at a collection (new arrivals first), and disappears when there is none.
	const filled = collections.data.filter(
		(c) => (c.productCollections?.length ?? 0) > 0 || (c.metafieldRules?.length ?? 0) > 0,
	);
	const fresh = filled.find((c) => /new/i.test(c.slug) || /new/i.test(c.name));
	const featured = fresh ?? filled[0] ?? null;
	const announcement: Announcement | null =
		threshold > 0
			? {
					text: `Free delivery on orders over ${formatMoney({ amount: BigInt(threshold), currency, locale })}`,
					href: null,
				}
			: featured
				? {
						text: fresh ? `${featured.name} are in — take a look` : `Discover ${featured.name}`,
						href: `/collection/${featured.slug}`,
					}
				: null;

	return {
		storeName: me?.store.name || settings?.storeName || "Your Next Store",
		description: settings?.storeDescription?.trim() || null,
		logo,
		announcement,
		blog: settings?.enabledTools?.blog ?? false,
		contactForm: settings?.enabledTools?.contactForm ?? false,
	};
}
