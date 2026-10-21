import { cacheLife } from "next/cache";
import { try_ } from "safe-try";
import { meGetCached } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { getStoreConfig } from "@/lib/store-config";

/** Store identity for the chrome: display name, tagline and the tools that add links. */
export async function getStoreIdentity() {
	"use cache";
	cacheLife("hours");

	const [error, me] = await try_(meGetCached());
	if (error) {
		return {
			name: "Your Next Store",
			description: null,
			freeShipping: null,
			blogEnabled: false,
			contactEnabled: false,
		};
	}
	const settings = me.store.settings;
	const threshold = settings?.freeShippingThreshold ? BigInt(settings.freeShippingThreshold) : null;
	const { currency, locale } = await getStoreConfig();

	return {
		name: settings?.storeName || me.store.name || "Your Next Store",
		description: settings?.storeDescription || null,
		freeShipping: threshold && threshold > 0n ? formatMoney({ amount: threshold, currency, locale }) : null,
		blogEnabled: settings?.enabledTools?.blog ?? false,
		contactEnabled: settings?.enabledTools?.contactForm ?? false,
	};
}

type Pictured = { images: string[]; variants: Array<{ images?: string[] | null }> };

const hasImage = (product: Pictured) =>
	product.images.length > 0 || product.variants.some((variant) => (variant.images ?? []).length > 0);

/** Photographed products first, keeping the given order otherwise. */
export function picturedFirst<T extends Pictured>(products: T[]): T[] {
	return [...products.filter(hasImage), ...products.filter((product) => !hasImage(product))];
}
