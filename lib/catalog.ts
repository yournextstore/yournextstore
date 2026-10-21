import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";

/** The store's display name: the name set in settings, else the store record's. */
export async function getStoreName() {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	return me?.store.settings?.storeName || me?.store.name || "Your Next Store";
}

/** Editorial photograph behind the hero word (a free Pexels photo, credited in NOTICE.md). */
export const HERO_PHOTO = "/images/pexels/hero-studio.jpg";

/**
 * The home hero's fitted word: the first active, non-empty collection's name (the original names its
 * campaign, "Evening"), else the store's name without a trailing domain ending.
 */
export async function getHeroData() {
	"use cache";
	cacheLife("minutes");
	const [collections, storeName] = await Promise.all([
		commerce.collectionBrowse({ limit: 8 }).catch(() => ({ data: [] })),
		getStoreName(),
	]);
	// Skip collections with nothing in them: the word should name something worth browsing.
	const collection = collections.data.find(
		(c) => c.active && (c.productCollections.length > 0 || (c.metafieldRules?.length ?? 0) > 0),
	);
	return {
		headline: collection?.name ?? storeName.replace(/\.(com|net|org|shop|store|co|pl|de|eu|uk|fr)$/i, ""),
		image: HERO_PHOTO,
	};
}
